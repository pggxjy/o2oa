package com.x.processplatform.assemble.surface.jaxrs.work;

import java.util.List;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonElement;
import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.project.exception.ExceptionAccessDenied;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.processplatform.assemble.surface.Business;
import com.x.processplatform.core.entity.element.Application;
import com.x.processplatform.core.entity.element.Process;
import com.x.processplatform.core.express.assemble.surface.jaxrs.work.ActionCreateWithApplicationProcessWi;

import io.swagger.v3.oas.annotations.media.Schema;

/*
 * 根据应用名称和流程名称进行创建,和直接用process创建基本相同
 * */
class ActionCreateWithApplicationProcess extends BaseCreateAction {

    private static final Logger LOGGER = LoggerFactory.getLogger(ActionCreateWithApplicationProcess.class);

    ActionResult<List<Wo>> execute(EffectivePerson effectivePerson, String applicationFlag, String processFlag,
            JsonElement jsonElement) throws Exception {
        LOGGER.debug("execute:{}, applicationFlag:{}, processFlag:{}.", effectivePerson::getDistinguishedName,
                () -> applicationFlag, () -> processFlag);
        // 新建工作id
        String workId = "";
        // 已存在草稿id
        String lastestWorkId = "";
        String identity = "";
        Process process = null;
        ActionResult<List<Wo>> result = new ActionResult<>();
        Wi wi = this.convertToWrapIn(jsonElement, Wi.class);
        try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
            Business business = new Business(emc);
            identity = this.decideCreatorIdentity(business, effectivePerson, wi.getIdentity());
            Application application = business.application().pick(applicationFlag);
            if (null == application) {
                throw new ExceptionApplicationNotExist(applicationFlag);
            }
            process = business.process().pickProcessEditionEnabled(application, processFlag);
            if (null == process) {
                throw new ExceptionProcessNotExist(processFlag);
            }
            if (BooleanUtils.isNotTrue(wi.getAllowEdition()) && StringUtils.isNotEmpty(process.getEdition())
                    && BooleanUtils.isFalse(process.getEditionEnable())) {
                process = business.process().pickEnabled(process.getApplication(), process.getEdition());
            }
            List<String> roles = business.organization().role().listWithPerson(effectivePerson);
            List<String> identities = business.organization().identity().listWithPerson(effectivePerson);
            List<String> units = business.organization().unit().listWithPersonSupNested(effectivePerson);
            if (!business.application().allowRead(effectivePerson, roles, identities, units, application)) {
                throw new ExceptionApplicationAccessDenied(effectivePerson.getDistinguishedName(), application.getId());
            }
            identities = List.of(identity);
            List<String> groups = business.organization().group().listWithIdentity(identities);
            if (!business.process().startable(effectivePerson, identities, units, groups, process)) {
                throw new ExceptionAccessDenied(effectivePerson, process);
            }
            if (BooleanUtils.isTrue(wi.getLatest())) {
                /* 判断是否是要直接打开之前创建的草稿,草稿的判断标准:有待办无任何已办 */
                workId = lastestWorkId = this.latest(business, process, identity);
            }
            if (BooleanUtils.isTrue(wi.getLatest())) {
                // 判断是否是要直接打开之前创建的草稿,草稿的判断标准:有待办无任何已办
                workId = lastestWorkId = this.latest(business, process, identity);
            }
        }
        if (StringUtils.isEmpty(workId)) {
            workId = this.createWork(process.getId(), wi.getData());
        }
        // 设置Work信息
        if (BooleanUtils.isFalse(wi.getLatest()) || (StringUtils.isEmpty(lastestWorkId))) {
            updateWork(identity, workId, wi.getTitle(), wi.getParentWork());
            // 驱动工作,使用非队列方式
            this.processingWork(workId);
        } else {
            // 如果是草稿,准备后面的直接打开
            workId = lastestWorkId;
        }
        List<Wo> wos = assemble(effectivePerson, workId);
        result.setData(wos);
        return result;
    }

    @Schema(description = "com.x.processplatform.assemble.surface.jaxrs.work.ActionCreateWithApplicationProcess$Wi")
    public static class Wi extends ActionCreateWithApplicationProcessWi {

        private static final long serialVersionUID = -6891996789972160214L;

    }

}

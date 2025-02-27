package com.x.processplatform.assemble.surface.jaxrs.attachment;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.BooleanUtils;

import com.google.gson.JsonElement;
import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.project.Applications;
import com.x.base.core.project.x_processplatform_service_processing;
import com.x.base.core.project.annotation.FieldDescribe;
import com.x.base.core.project.exception.ExceptionAccessDenied;
import com.x.base.core.project.exception.ExceptionEntityNotExist;
import com.x.base.core.project.gson.GsonPropertyObject;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.jaxrs.WoId;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.base.core.project.tools.ListTools;
import com.x.processplatform.assemble.surface.Business;
import com.x.processplatform.assemble.surface.ThisApplication;
import com.x.processplatform.assemble.surface.WorkControl;
import com.x.processplatform.core.entity.content.Attachment;
import com.x.processplatform.core.entity.content.WorkCompleted;

import io.swagger.v3.oas.annotations.media.Schema;

class ActionCopyToWorkCompleted extends BaseAction {

	private static final Logger LOGGER = LoggerFactory.getLogger(ActionCopyToWorkCompleted.class);

	ActionResult<List<Wo>> execute(EffectivePerson effectivePerson, String workCompletedId, JsonElement jsonElement)
			throws Exception {

		LOGGER.debug("execute:{}, workCompletedId:{}.", effectivePerson::getDistinguishedName, () -> workCompletedId);

		ActionResult<List<Wo>> result = new ActionResult<>();
		List<Wo> wos = new ArrayList<>();
		Wi wi = this.convertToWrapIn(jsonElement, Wi.class);

		WorkCompleted workCompleted = null;
		Req req = new Req();

		try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
			Business business = new Business(emc);

			workCompleted = emc.flag(workCompletedId, WorkCompleted.class);
			if ((null == workCompleted)) {
				throw new ExceptionEntityNotExist(workCompletedId, WorkCompleted.class);
			}
			if (BooleanUtils.isNotTrue(business.canManageApplicationOrProcess(effectivePerson,
					workCompleted.getApplication(), workCompleted.getProcess()))) {
				throw new ExceptionAccessDenied(effectivePerson);
			}

			if (ListTools.isNotEmpty(wi.getAttachmentList())) {
				for (WiAttachment w : wi.getAttachmentList()) {
					Attachment o = emc.find(w.getId(), Attachment.class);
					if (null == o) {
						throw new ExceptionEntityNotExist(w.getId(), Attachment.class);
					}
					if (!business.readableWithJob(effectivePerson, o.getJob())) {
						throw new ExceptionAccessDenied(effectivePerson, o.getJob());
					}
					ReqAttachment q = new ReqAttachment();
					q.setId(o.getId());
					q.setName(w.getName());
					q.setSite(w.getSite());
					q.setSoftCopy(false);
					req.getAttachmentList().add(q);
				}
			}
		}

		if (ListTools.isNotEmpty(req.getAttachmentList())) {
			wos = ThisApplication.context().applications()
					.postQuery(effectivePerson.getDebugger(), x_processplatform_service_processing.class,
							Applications.joinQueryUri("attachment", "copy", "workcompleted", workCompleted.getId()),
							req, workCompleted.getJob())
					.getDataAsList(Wo.class);
		}

		result.setData(wos);
		return result;
	}

	public static class Req extends GsonPropertyObject {

		private static final long serialVersionUID = -3546487034950391385L;

		List<ReqAttachment> attachmentList = new ArrayList<>();

		public List<ReqAttachment> getAttachmentList() {
			return attachmentList;
		}

		public void setAttachmentList(List<ReqAttachment> attachmentList) {
			this.attachmentList = attachmentList;
		}

	}

	@Schema(name = "com.x.processplatform.assemble.surface.jaxrs.attachment.ActionCopyToWorkCompleted$Wi")
	public static class Wi extends GsonPropertyObject {

		private static final long serialVersionUID = -455300115594765428L;

		@FieldDescribe("附件对象")
		private List<WiAttachment> attachmentList = new ArrayList<>();

		public List<WiAttachment> getAttachmentList() {
			return attachmentList;
		}

		public void setAttachmentList(List<WiAttachment> attachmentList) {
			this.attachmentList = attachmentList;
		}

	}

	@Schema(name = "com.x.processplatform.assemble.surface.jaxrs.attachment.ActionCopyToWorkCompleted$WiAttachment")
	public static class WiAttachment extends GsonPropertyObject {

		private static final long serialVersionUID = -308348301935328134L;

		private String id;
		private String name;
		private String site;

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getSite() {
			return site;
		}

		public void setSite(String site) {
			this.site = site;
		}

	}

	@Schema(name = "com.x.processplatform.assemble.surface.jaxrs.attachment.ActionCopyToWorkCompleted$Wo")
	public static class Wo extends WoId {

		private static final long serialVersionUID = 6235554869680662821L;

	}

}

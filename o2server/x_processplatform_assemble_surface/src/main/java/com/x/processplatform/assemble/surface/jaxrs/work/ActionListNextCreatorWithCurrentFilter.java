package com.x.processplatform.assemble.surface.jaxrs.work;

import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonElement;
import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.entity.JpaObject;
import com.x.base.core.project.annotation.FieldDescribe;
import com.x.base.core.project.bean.WrapCopier;
import com.x.base.core.project.bean.WrapCopierFactory;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.jaxrs.EqualsTerms;
import com.x.base.core.project.jaxrs.InTerms;
import com.x.base.core.project.jaxrs.LikeTerms;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.base.core.project.tools.ListTools;
import com.x.processplatform.assemble.surface.WorkControl;
import com.x.processplatform.core.entity.content.Work;
import com.x.processplatform.core.express.assemble.surface.jaxrs.work.ActionListNextCreatorWithCurrentFilterWi;

import io.swagger.v3.oas.annotations.media.Schema;

class ActionListNextCreatorWithCurrentFilter extends BaseAction {

	private static final Logger LOGGER = LoggerFactory.getLogger(ActionListNextCreatorWithCurrentFilter.class);

	ActionResult<List<Wo>> execute(EffectivePerson effectivePerson, String id, Integer count, JsonElement jsonElement)
			throws Exception {
		LOGGER.debug("execute:{}, id:{}, count:{}.", effectivePerson::getDistinguishedName, () -> id, () -> count);
		try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
			ActionResult<List<Wo>> result = new ActionResult<>();
			Wi wi = this.convertToWrapIn(jsonElement, Wi.class);
			EqualsTerms equals = new EqualsTerms();
			InTerms ins = new InTerms();
			LikeTerms likes = new LikeTerms();
			equals.put(Work.creatorPerson_FIELDNAME, effectivePerson.getDistinguishedName());
			if (ListTools.isNotEmpty(wi.getProcessList())) {
				ins.put(Work.process_FIELDNAME, wi.getProcessList());
			}
			if (ListTools.isNotEmpty(wi.getCreatorUnitList())) {
				ins.put(Work.creatorUnit_FIELDNAME, wi.getCreatorUnitList());
			}
			if (ListTools.isNotEmpty(wi.getStartTimeMonthList())) {
				ins.put(Work.startTimeMonth_FIELDNAME, wi.getStartTimeMonthList());
			}
			if (ListTools.isNotEmpty(wi.getActivityNameList())) {
				ins.put(Work.activityName_FIELDNAME, wi.getActivityNameList());
			}
			if (ListTools.isNotEmpty(wi.getWorkStatusList())) {
				ins.put(Work.workStatus_FIELDNAME, wi.getWorkStatusList());
			}
			if (StringUtils.isNotEmpty(wi.getKey())) {
				String key = StringUtils.trim(StringUtils.replace(wi.getKey(), "\u3000", " "));
				if (StringUtils.isNotEmpty(key)) {
					likes.put(Work.title_FIELDNAME, key);
					likes.put(Work.serial_FIELDNAME, key);
					likes.put(Work.creatorPerson_FIELDNAME, key);
					likes.put(Work.creatorUnit_FIELDNAME, key);
				}
			}

			result = this.standardListNext(Wo.copier, id, count, JpaObject.sequence_FIELDNAME, equals, null, likes, ins,
					null, null, null, null, true, DESC);

			return result;
		}
	}

	@Schema(name = "com.x.processplatform.assemble.surface.jaxrs.work.ActionListNextCreatorWithCurrentFilter$Wi")
	public static class Wi extends ActionListNextCreatorWithCurrentFilterWi {

	}

	@Schema(name = "com.x.processplatform.assemble.surface.jaxrs.work.ActionListNextCreatorWithCurrentFilter$Wo")
	public static class Wo extends Work {

		private static final long serialVersionUID = -5668264661685818057L;

		static WrapCopier<Work, Wo> copier = WrapCopierFactory.wo(Work.class, Wo.class, null,
				JpaObject.FieldsInvisible);

		@FieldDescribe("排序号.")
		@Schema(description = "排序号.")
		private Long rank;

		@FieldDescribe("权限.")
		@Schema(description = "权限.")
		private WorkControl control;

		public Long getRank() {
			return rank;
		}

		public void setRank(Long rank) {
			this.rank = rank;
		}

		public WorkControl getControl() {
			return control;
		}

		public void setControl(WorkControl control) {
			this.control = control;
		}

	}

	@Schema(name = "com.x.processplatform.assemble.surface.jaxrs.work.ActionListNextCreatorWithCurrentFilter$WoControl")
	public static class WoControl extends WorkControl {

		private static final long serialVersionUID = 8347046567472555562L;

	}
}

package com.x.processplatform.core.express.assemble.surface.jaxrs.task;

import java.util.List;

import com.google.gson.JsonElement;
import com.x.base.core.project.annotation.FieldDescribe;
import com.x.base.core.project.gson.GsonPropertyObject;
import com.x.base.core.project.tools.ListTools;

import io.swagger.v3.oas.annotations.media.Schema;

public class ActionProcessingWi extends GsonPropertyObject {

	private static final long serialVersionUID = -870819172943535910L;

	@FieldDescribe("待办选择路由名称.")
	@Schema(description = "待办选择路由名称.")
	private String routeName;

	@FieldDescribe("待办办理意见.")
	@Schema(description = "待办办理意见.")
	private String opinion;

	@FieldDescribe("多媒体意见.")
	@Schema(description = "多媒体意见.")
	private String mediaOpinion;

	@FieldDescribe("路由数据.")
	@Schema(description = "路由数据.")
	private JsonElement routeData;

	@FieldDescribe("新添加的待办处理人身份.")
	@Schema(description = "新添加的待办处理人身份.")
	private List<String> appendTaskIdentityList;

	@FieldDescribe("忽略授权身份.")
	@Schema(description = "忽略授权身份.")
	private List<String> ignoreEmpowerIdentityList;

	public List<String> getAppendTaskIdentityList() {
		return ListTools.trim(appendTaskIdentityList, true, true);
	}

	public List<String> getIgnoreEmpowerIdentityList() {
		return ListTools.trim(ignoreEmpowerIdentityList, true, true);
	}

	public void setAppendTaskIdentityList(List<String> appendTaskIdentityList) {
		this.appendTaskIdentityList = appendTaskIdentityList;
	}

	public String getRouteName() {
		return routeName;
	}

	public void setRouteName(String routeName) {
		this.routeName = routeName;
	}

	public String getOpinion() {
		return opinion;
	}

	public void setOpinion(String opinion) {
		this.opinion = opinion;
	}

	public String getMediaOpinion() {
		return mediaOpinion;
	}

	public void setMediaOpinion(String mediaOpinion) {
		this.mediaOpinion = mediaOpinion;
	}

	public JsonElement getRouteData() {
		return routeData;
	}

	public void setRouteData(JsonElement routeData) {
		this.routeData = routeData;
	}

	public void setIgnoreEmpowerIdentityList(List<String> ignoreEmpowerIdentityList) {
		this.ignoreEmpowerIdentityList = ignoreEmpowerIdentityList;
	}
}
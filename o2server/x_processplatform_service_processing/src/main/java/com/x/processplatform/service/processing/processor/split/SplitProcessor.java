package com.x.processplatform.service.processing.processor.split;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.script.CompiledScript;
import javax.script.ScriptContext;

import org.apache.commons.lang3.StringUtils;

import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.project.scripting.JsonScriptingExecutor;
import com.x.base.core.project.tools.ListTools;
import com.x.base.core.project.tools.StringTools;
import com.x.processplatform.core.entity.content.Work;
import com.x.processplatform.core.entity.content.WorkLog;
import com.x.processplatform.core.entity.element.Route;
import com.x.processplatform.core.entity.element.Split;
import com.x.processplatform.core.entity.log.Signal;
import com.x.processplatform.service.processing.Business;
import com.x.processplatform.service.processing.processor.AeiObjects;

public class SplitProcessor extends AbstractSplitProcessor {

	public SplitProcessor(EntityManagerContainer entityManagerContainer) throws Exception {
		super(entityManagerContainer);
	}

	@Override
	protected Work arriving(AeiObjects aeiObjects, Split split) throws Exception {
		// 发送ProcessingSignal
		aeiObjects.getProcessingAttributes().push(Signal.splitArrive(aeiObjects.getWork().getActivityToken(), split));
		return aeiObjects.getWork();
	}

	@Override
	protected void arrivingCommitted(AeiObjects aeiObjects, Split split) throws Exception {
		// nothing
	}

	@Override
	protected List<Work> executing(AeiObjects aeiObjects, Split split) throws Exception {
		List<Work> results = new ArrayList<>();
		// 标志拆分状态
		aeiObjects.getWork().setSplitting(true);
		aeiObjects.getWork().setSplitToken(StringTools.uniqueToken());
		aeiObjects.getWork().getSplitTokenList().add(aeiObjects.getWork().getSplitToken());
		List<String> splitValues = this.splitWithPath(aeiObjects, split);
		if (splitValues.isEmpty()) {
			throw new ExceptionSplitEmptySplitValue(split.getName(), aeiObjects.getWork().getTitle(),
					aeiObjects.getWork().getId(), aeiObjects.getWork().getJob());
		}
		// 发送ProcessingSignal
		aeiObjects.getProcessingAttributes()
				.push(Signal.splitExecute(aeiObjects.getWork().getActivityToken(), split, splitValues));
		// 先将当前文档标志拆分值
		aeiObjects.getWork().setSplitValue(splitValues.get(0));
		List<String> values = new ArrayList<>(aeiObjects.getWork().getSplitValueList());
		values.add(splitValues.get(0));
		aeiObjects.getWork().setSplitValueList(values);
		results.add(aeiObjects.getWork());
		Optional<WorkLog> optionalWorkLog = aeiObjects.getWorkLogs().stream()
				.filter(o -> StringUtils.equals(aeiObjects.getWork().getActivityToken(), o.getFromActivityToken()))
				.findFirst();
		if (optionalWorkLog.isPresent()) {
			WorkLog mainWorkLog = optionalWorkLog.get();
			mainWorkLog.setSplitting(true);
			mainWorkLog.setSplitToken(aeiObjects.getWork().getSplitToken());
			mainWorkLog.setSplitTokenList(aeiObjects.getWork().getSplitTokenList());
			mainWorkLog.setSplitValue(splitValues.get(0));
			mainWorkLog.setSplitValueList(aeiObjects.getWork().getSplitValueList());
			aeiObjects.getUpdateWorkLogs().add(mainWorkLog);
			// 产生后续的拆分文档并标记拆分值
			for (int i = 1; i < splitValues.size(); i++) {
				Work splitWork = splitWork(aeiObjects, splitValues.get(i));
				aeiObjects.getCreateWorks().add(splitWork);
				WorkLog splitWorkLog = splitWorkLog(aeiObjects, mainWorkLog, splitValues.get(i), splitWork);
				aeiObjects.getCreateWorkLogs().add(splitWorkLog);
				results.add(splitWork);
			}
		}
		return results;
	}

	private WorkLog splitWorkLog(AeiObjects aeiObjects, WorkLog mainWorkLog, String value, Work splitWork)
			throws IllegalAccessException, InvocationTargetException, NoSuchMethodException {
		WorkLog splitWorkLog = new WorkLog(mainWorkLog);
		splitWorkLog.setSplitWork(aeiObjects.getWork().getId());
		splitWorkLog.setWork(splitWork.getId());
		splitWorkLog.setSplitValue(value);
		List<String> values = new ArrayList<>(splitWorkLog.getSplitValueList());
		ListTools.set(values, -1, value);
		splitWorkLog.setSplitValueList(values);
		return splitWorkLog;
	}

	private Work splitWork(AeiObjects aeiObjects, String value) throws Exception {
		Work splitWork = new Work(aeiObjects.getWork());
		// 替work换拆分值
		splitWork.setSplitValue(value);
		List<String> values = new ArrayList<>(splitWork.getSplitValueList());
		ListTools.set(values, -1, value);
		splitWork.setSplitValueList(values);
		return splitWork;
	}

	@Override
	protected void executingCommitted(AeiObjects aeiObjects, Split split, List<Work> works) throws Exception {
		// nothing
	}

	@Override
	protected List<Route> inquiring(AeiObjects aeiObjects, Split split) throws Exception {
		// 发送ProcessingSignal
		aeiObjects.getProcessingAttributes().push(Signal.splitInquire(aeiObjects.getWork().getActivityToken(), split));
		List<Route> results = new ArrayList<>();
		results.add(aeiObjects.getRoutes().get(0));
		return results;
	}

	private List<String> splitWithPath(AeiObjects aeiObjects, Split split) throws Exception {
		List<String> list = new ArrayList<>();
		if ((StringUtils.isNotEmpty(split.getScript())) || (StringUtils.isNotEmpty(split.getScriptText()))) {
			ScriptContext scriptContext = aeiObjects.scriptContext();
			CompiledScript cs = aeiObjects.business().element().getCompiledScript(aeiObjects.getWork().getApplication(),
					split, Business.EVENT_SPLIT);
			List<String> os = JsonScriptingExecutor.evalDistinguishedNames(cs, scriptContext);
			list.addAll(os);
		}
		return list;
	}

	@Override
	protected void inquiringCommitted(AeiObjects aeiObjects, Split split) throws Exception {
		// nothing
	}
}
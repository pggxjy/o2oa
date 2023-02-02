/**
 * 数据表格数据结构.
 * @typedef {Array} DatatableData
 * @example
 { //数据表格数据条目
  "data": [
    {
      "org": [{
        "distinguishedName": "张三@bf007525-99a3-4178-a474-32865bdddec8@I",
        "id": "bf007525-99a3-4178-a474-32865bdddec8",
        "name": "张三",
        "person": "0c828550-d8ab-479e-9880-09a59332f1ed",
        "unit": "9e6ce205-86f6-4d84-96e1-83147567aa8d",
        "unitLevelName": "兰德纵横/市场营销部",
        "unitName": "市场营销部"
      }],
      "org_1": [{
        "distinguishedName": "张三@bf007525-99a3-4178-a474-32865bdddec8@I",
        "id": "bf007525-99a3-4178-a474-32865bdddec8",
        "name": "张三",
        "person": "0c828550-d8ab-479e-9880-09a59332f1ed",
        "unit": "9e6ce205-86f6-4d84-96e1-83147567aa8d",
        "unitLevelName": "兰德纵横/市场营销部",
        "unitName": "市场营销部"
      }, {
        "distinguishedName": "李四@bf007525-99a3-4178-a474-32865bdddec8@I",
        "id": "bf007525-99a3-4178-a474-32865bdddec8",
        "name": "李四",
        "person": "0c828550-d8ab-479e-9880-09a59332f1ed",
        "unit": "9e6ce205-86f6-4d84-96e1-83147567aa8d",
        "unitLevelName": "兰德纵横/市场营销部",
        "unitName": "市场营销部"
      }],
      "number": "111",
      "textfield": "杭州",
      "attachment": [
        {
          "activityName": "拟稿",
          "extension": "jpg",
          "id": "9514758e-9e28-4bfe-87d7-824f2811f173",
          "lastUpdateTime": "2020-12-09 21:48:03",
          "length": 452863.0,
          "name": "111.jpg",
          "person": "李四@lisi@P"
        }
      ]
    }
    ...
  ],
  "total": {
    "number": 222, //总计采用字段id
    "textfield": 2
  }
}
 */
MWF.xDesktop.requireApp("process.Xform", "$Module", null, false);
/** @class DatatablePC 数据表格组件。表格形式的多行数据编辑组件。
 * @o2cn 数据表格PC端
 * @example
 * //可以在脚本中获取该组件
 * //方法1：
 * var datatable = this.form.get("name"); //获取组件
 * //方法2
 * var datatable = this.target; //在组件事件脚本中获取
 * @extends MWF.xApplication.process.Xform.$Module
 * @o2category FormComponents
 * @since v6.2
 * @o2range {Process|CMS|Portal}
 * @hideconstructor
 */
MWF.xApplication.process.Xform.DatatablePC = new Class(
	/** @lends MWF.xApplication.process.Xform.DatatablePC# */
	{
		Implements: [Events],
		Extends: MWF.APP$Module,
		isEdit: false,
		options: {
			/**
			 * 所有内容加载后执行（包括异步加载）。
			 * @event MWF.xApplication.process.Xform.DatatablePC#afterLoad
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 */
			/**
			 * 每初始化一个条目，但未加载的时候触发，通过this.event可以获取条目对象。
			 * @event MWF.xApplication.process.Xform.DatatablePC#beforeLoadLine
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 */
			/**
			 * 每一个条目加载后时候触发，通过this.event可以获取条目对象。
			 * @event MWF.xApplication.process.Xform.DatatablePC#afterLoadLine
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 */
			/**
			 * 数据表格改变时触发。通过this.event.lines可以获取修改的条目数组，this.event.type可以获得修改的类型。<br/>
			 * <table>
			 *     <tr><th><b>this.event.type</b></th><th><b>触发类型</b></th><th><b>this.event.lines</b></th></tr>
			 *     <tr><td>addline</td><td>添加一行</td><td>添加的行数组</td></tr>
			 *     <tr><td>deleteline</td><td>删除一行</td><td>删除的行数组</td></tr>
			 *     <tr><td>editcomplete</td><td>某行完成编辑（点击当前编辑行前面的√执行。同时编辑多行忽略）</td><td>编辑的行数组</td></tr>
			 *     <tr><td>editmodule</td><td>字段值改变时（同时编辑多行触发此事件，每次编辑单行忽略）</td><td>this.event.lines为编辑的行数组<br/>this.event.module为修改的字段</td></tr>
			 *     <tr><td>move</td><td>通过向上箭头调整行顺序</td><td>数据表格所有行</td></tr>
			 *     <tr><td>import</td><td>导入数据后</td><td>数据表格所有行</td></tr>
			 * </table>
			 * @event MWF.xApplication.process.Xform.DatatablePC#change
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 */
			/**
			 * 添加条目时触发。通过this.event.line可以获取对应的条目对象，this.event.ev可以获得事件触发的Event。
			 * @event MWF.xApplication.process.Xform.DatatablePC#addLine
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 */
			/**
			 * 编辑条目时触发（同时编辑多行不触发此事件）。通过this.event可以获取对应的条目对象。
			 * @event MWF.xApplication.process.Xform.DatatablePC#editLine
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 */
			/**
			 * 完成编辑条目时触发（点击当前编辑行前面的√执行。同时编辑多行不触发此事件）。通过this.event可以获取对应的条目对象。
			 * @event MWF.xApplication.process.Xform.DatatablePC#completeLineEdit
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 */
			/**
			 * 取消编辑条目时触发（点击当前编辑行前面的 — 执行。同时编辑多行不触发此事件）。通过this.event可以获取对应的条目对象。
			 * @event MWF.xApplication.process.Xform.DatatablePC#cancelLineEdit
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 */
			/**
			 * 删除条目前触发。通过this.event可以获取对应的条目对象。
			 * @event MWF.xApplication.process.Xform.DatatablePC#deleteLine
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 */
			/**
			 * 删除条目后触发。
			 * @event MWF.xApplication.process.Xform.DatatablePC#afterDeleteLine
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 */
			/**
			 * 导出excel的时候触发，this.event指向导出的数据，您可以通过修改this.event来修改数据。
			 * @event MWF.xApplication.process.Xform.DatatablePC#export
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 * @example
			 * <caption>this.event数据格式如下：</caption>
			 * {
			 *  	data : [
			 *   		["姓名","性别","学历","专业","出生日期","毕业日期"], //标题
			 *  		[ "张三","男","大学本科","计算机","2001-1-2","2019-9-2" ], //第一行数据
			 *  		[ "李四","男","大学专科","数学","1998-1-2","2018-9-2" ]  //第二行数据
			 * 	], //导出的数据
			 *     colWidthArray : [100, 50, 100, 200, 150, 150], //每列宽度
			 *     title : "xxxx" //导出的excel文件标题
			 * }
			 */
			/**
			 * 在导入excel，进行数据校验后触发，this.event指向导入的数据。
			 * @event MWF.xApplication.process.Xform.DatatablePC#validImport
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 * @example
			 * <caption>this.event数据格式如下：</caption>
			 * {
			 *  	data : [
			 *  	   {
			 *  	 	"姓名" : "张三",
			 *  	 	"性别" : "男",
			 *  	 	"学历" ： "大学本科",
			 *  	    "专业" : "计算机",
			 *  	    "出生日期" : "aa01-1-2",
			 *  	 	"毕业日期" : "2019-9-2",
			 *  	 	"errorTextList" : [
			 *  	 	    "第5列：aa01-1-2不是正确的日期格式。"
			 *  	 	] //校验出的错误信息，如果该行数据正确，则无该字段
			 *  	 }
			 *  	 ...
			 *     ], //导入的数据
			 *     "validted" : true  //是否校验通过，可以在本事件中修改该参数，确定是否强制导入
			 * }
			 */
			/**
			 * 在导入excel，数据校验成功将要设置回数据表格的时候触发，this.event指向整理过的导入数据，格式见{@link DatatableData}。
			 * @event MWF.xApplication.process.Xform.DatatablePC#import
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 */
			/**
			 * 在导入excel，数据设置回数据表格以后触发，this.event指向整理过的导入数据，格式见{@link DatatableData}。
			 * @event MWF.xApplication.process.Xform.DatatablePC#afterImport
			 * @see {@link https://www.yuque.com/o2oa/ixsnyt/hm5uft#i0zTS|组件事件说明}
			 */
			"moduleEvents": ["queryLoad","postLoad","load", "afterLoad",
				"beforeLoadLine", "afterLoadLine", "change", "addLine", "deleteLine", "afterDeleteLine", "editLine", "completeLineEdit", "cancelLineEdit", "export", "import", "validImport", "afterImport"]
		},

		initialize: function(node, json, form, options){
			this.node = $(node);
			this.node.store("module", this);
			this.json = json;
			this.form = form;
			this.field = true;
			this.fieldModuleLoaded = false;
		},
		load: function(){
			this._loadModuleEvents();
            if (this.fireEvent("queryLoad")){
				this._queryLoaded();
                if( this.isSectionMergeEdit() ){ //区段合并，删除区段值合并数据后编辑
                    if( this.json.mergeTypeEdit === "script" ){
                        this._loadMergeEditNodeByScript();
                    }else{
                        this._loadMergeEditNodeByDefault();
                    }
                }else{
				    this._loadUserInterface();
			    }
                this._loadStyles();
                this._loadDomEvents();
                //this._loadEvents();

                this._afterLoaded();
                this.fireEvent("afterLoad");
                // this.fireEvent("load");
			}
		},
		_loadMergeEditNodeByScript: function(){
			if (this.json.sectionMergeEditScript && this.json.sectionMergeEditScript.code) {
				var data = this.form.Macro.exec(this.json.sectionMergeEditScript.code, this);
				this._setBusinessData( data );
				this._loadUserInterface();
			}
		},
		_loadMergeEditNodeByDefault: function(){
			var data = this.getSortedSectionData();
			var businessData = [];
			data.each(function(d){
				d.data = d.data || {};
				businessData = businessData.concat( d.data.data || [] );
			});
			this._setBusinessData({
				data: businessData
			});
			this._loadUserInterface();
		},
		_loadUserInterface: function(){
			// this.fireEvent("queryLoad");
			debugger;

			//区段合并展现
			this.isMergeRead = this.isSectionMergeRead();

			//启用区段且显示所有区段
			this.sectionBy = this._getSectionBy();
			this.isShowAllSection = this.isAllSectionShow();

			this.editModules = [];

			if( !layout.mobile ){
				this.node.setStyle("overflow-x", "auto");
				this.node.setStyle("overflow-y", "hidden");
			}
			this.table = this.node.getElement("table");
			this.tBody = this.table.getElement("tbody");

			this.editable = !(this.readonly || (this.json.isReadonly === true) || (this.form.json.isReadonly === true));
			if( this.isMergeRead )this.editable = false;
			if (this.editable && this.json.editableScript && this.json.editableScript.code){
				this.editable = this.form.Macro.exec(((this.json.editableScript) ? this.json.editableScript.code : ""), this);
			}

			this.deleteable = this.json.deleteable !== "no";
			this.addable = this.json.addable !== "no";
			this.sortable = this.json.sortable !== "no";

			//允许导入
			this.importenable  = this.editable && (this.json.impexpType === "impexp" || this.json.impexpType === "imp");
			//允许导出
			this.exportenable  = this.json.impexpType === "impexp" || this.json.impexpType === "exp";

			//是否多行同时编辑
			this.multiEditMode = this.json.editMode === "multi";

			//是否有总计列
			this.totalFlag = false;
			this.totalColumns = [];
			this.totalNumberModuleIds = [];

			// this.hiddenColIndexList = [];

			if( this.isShowAllSection ){
				this.data = this.getAllSectionData()
			}else if( this.isMergeRead ){
				this.data = this.getSectionMergeReadData()
			}else{
				this.data = this.getValue();
				if( !this._getBusinessData() ){
					this.isNew = true;
					this._setValue(this.data);
				}
			}


			this.lineList = [];
			this.sectionlineList = [];

			this.loadDatatable();
		},
		reload: function(){
			this.reloading = true;
			var tr = this.titleTr;
			var node;
			if( tr ){
				node = tr.getElement("th.mwf_addlineaction");
				if( node )node.destroy();
				node = tr.getElement("th.mwf_moveaction");
				if( node )node.destroy();
			}

			tr = this.templateTr;
			if( tr ){
				node = tr.getElement("td.mwf_editaction");
				if( node )node.destroy();
				node = tr.getElement("td.mwf_moveaction");
				if( node )node.destroy();
			}

			this.clearSubModules();
			this.loadDatatable();
			this.reloading = false;
		},
		loadDatatable: function(){
			this.loading = true;
			this._loadStyles();

			this._loadTitleTr();
			this._loadTemplate();
			this._loadTotalTr();

			this.fireEvent("load");
			this._loadDatatable(function(){
				this._loadImportExportAction();
				this.fieldModuleLoaded = true;
				this.loading = false;
				this.fireEvent("postLoad");
			}.bind(this));
		},
		_loadTitleTr: function(){
			this.titleTr = this.table.getElement("tr");

			var ths = this.titleTr.getElements("th");
			if (this.json.border){
				ths.setStyles({
					"border-bottom": this.json.border,
					"border-right": this.json.border
				});
			}
			if (this.json.titleStyles)ths.setStyles(this.json.titleStyles);

			//datatable$Title Module
			ths.each(function(th, index){
				var json = this.form._getDomjson(th);
				th.store("dataTable", this);
				th.addClass("mwf_origional");
				if (json){
					var module = this.form._loadModule(json, th);
					this.form.modules.push(module);
					if( json.isShow === false ){
						th.hide(); //隐藏列
					}else if( this.reloading && json.isShow === true){
						th.setStyle("display", "");
					}
					if((json.total === "number") || (json.total === "count"))this.totalFlag = true;
				}
			}.bind(this));


			if(this.editable){
				var actionTh = new Element("th.mwf_addlineaction", {"styles": {"width": "46px"}}).inject(this.titleTr, "top"); //操作列
				if(this.addable){
					var addLineAction = new Element("div", {
						"styles": this.form.css.addLineAction,
						"events": {
							"click": function(e){ this._addLine(e.target, true); }.bind(this)
						}
					}).inject(actionTh);
				}
				var moveTh;
				if( this.sortable ){
					moveTh = new Element("th.mwf_moveaction").inject(this.titleTr, "bottom"); //总计列
				}
				if (this.json.border){
					Array.each([actionTh,moveTh], function(th){
						if(th)th.setStyles({
							"border-bottom": this.json.border,
							"border-right": this.json.border
						})
					}.bind(this));
				}
				if (this.json.titleStyles){
					actionTh.setStyles(this.json.titleStyles);
					if(moveTh)moveTh.setStyles(this.json.titleStyles);
				}
			}
		},
		_loadTemplate: function(){
			// this.templateJson = {};

			var trs = this.table.getElements("tr");
			this.templateTr = trs[trs.length-1];

			this.templateNode = this.templateTr;

			var tds = this.templateNode.getElements("td");

			this.columnCount = tds.length;

			if (this.json.border) {
				tds.setStyles({
					"border-bottom": this.json.border,
					"border-right": this.json.border,
					"background": "transparent"
				});
			}
			if (this.json.contentStyles)tds.setStyles(this.json.contentStyles);

			//datatable$Data Module
			tds.each(function(td, index){
				var json = this.form._getDomjson(td);
				td.store("dataTable", this);
				td.addClass("mwf_origional");
				if (json){
					// var module = this.form._loadModule(json, td);
					// this.form.modules.push(module);
					if( json.cellType === "sequence" )td.addClass("mwf_sequence"); //序号列
					if( json.isShow === false ){
						td.hide(); //隐藏列
					}else if( this.reloading && json.isShow === true){
						td.setStyle("display", "");
					}
				}
			}.bind(this));

			if(this.editable){
				var eTd = new Element("td.mwf_editaction",{"styles": this.json.actionStyles || {}}).inject(this.templateNode, "top"); //操作列
				this.columnCount = this.columnCount+1;
				var mTd;
				if( this.sortable ){
					mTd= new Element("td.mwf_moveaction", {"styles": this.form.css.gridMoveActionCell || {}}).inject(this.templateNode, "bottom");
					this.columnCount = this.columnCount+1;
				} //排序列
				if (this.json.border){
					Array.each([eTd,mTd], function(td){
						if(td)td.setStyles({
							"border-bottom": this.json.border,
							"border-right": this.json.border,
							"background": "transparent"
						})
					}.bind(this));
				}
				if (this.json.contentStyles){
					eTd.setStyles(this.json.contentStyles);
					if(mTd)mTd.setStyles(this.json.contentStyles);
				}
			}

			this.templateHtml = this.templateNode.get("html");
			// var moduleNodes = this.form._getModuleNodes(this.templateNode);
			// moduleNodes.each(function (node) {
			// 	if (node.get("MWFtype") !== "form") {
			// 		var json = this.form._getDomjson(node);
			// 		this.templateJson[json.id] = json ;
			// 	}
			// }.bind(this));
			this.templateNode.hide();
		},
		_loadTotalTr: function(){
			if( !this.totalFlag )return;
			this.totalTr = new Element("tr.mwf_totaltr", {"styles": this.form.css.datagridTotalTr}).inject(this.tBody||this.table);

			if( this.isShowSectionKey() && !(this.json.totalRowBySection || [] ).contains("module")){
				this.totalTr.hide()
			}
			if( this.isShowSectionBy() && !(this.json.totalRowBy || [] ).contains("module") ){
				this.totalTr.hide()
			}

			var ths = this.titleTr.getElements("th");
			//datatable$Title Module
			ths.each(function(th, index){
				var td = new Element("td", {"text": "", "styles": this.form.css.datagridTotalTd}).inject(this.totalTr);
				if (this.json.amountStyles) td.setStyles(this.json.amountStyles);

				var json = this.form._getDomjson(th);
				if (json){
					if( json.isShow === false ){
						td.hide(); //隐藏列
					}else if( this.reloading && json.isShow === true){
						td.setStyle("display", "");
					}
					if ((json.total === "number") || (json.total === "count")){
						this.totalColumns.push({
							"th" : th,
							"td" : td,
							"index": index,
							"type": json.total
						})
					}
				}
			}.bind(this));

			var tds = this.templateTr.getElements("td");
			//datatable$Data Module
			tds.each(function(td, index){
				var json = this.form._getDomjson(td);
				if (json){
					//总计列
					var tColumn = this.totalColumns.find(function(a){ return  a.index === index });
					if(tColumn){
						var moduleNodes = this.form._getModuleNodes(td); //获取总计列内的填写组件
						if( moduleNodes.length > 0 ){
							tColumn.moduleJson = this.form._getDomjson(moduleNodes[0]);
							if(tColumn.type === "number")this.totalNumberModuleIds.push( tColumn.moduleJson.id );
						}
					}
				}
			}.bind(this));
		},
		_loadTotal: function(){
			var totalData = {};
			if (!this.totalFlag)return totalData;
			if (!this.totalTr)this._loadTotalTr();
			var data;
			if( this.isShowAllSection ){
				data = { data : [] };
				Object.each( this.getBusinessDataById(), function (d, key) {
					if( !["data","total"].contains(key) ){
						data.data = data.data.concat( d.data )
					}
				})
			}else if( this.isMergeRead ){
				data = this.data;
			}else{
				data = this.getValue();
			}
			this.totalColumns.each(function(column, index){
				var json = column.moduleJson;
				if(!json)return;

				var pointLength = 0; //小数点后的最大数位
				var tmpV;
				if (column.type === "count"){
					tmpV = data.data.length;
				}else if(column.type === "number"){
					tmpV = new Decimal(0);
					for (var i=0; i<data.data.length; i++){
						var d = data.data[i];
						if(d[json.id]){
							tmpV = tmpV.plus(d[json.id].toFloat() || 0);
							var v = d[json.id].toString();
							if( v.indexOf(".") > -1 ){
								pointLength = Math.max(pointLength, v.split(".")[1].length);
							}
						}
					}
				}

				if( isNaN( tmpV ) ){
					totalData[json.id] = "";
					column.td.set("text", "" );
				}else{
					if( pointLength > 0 && tmpV.toString() !== "0" ){
						var s = tmpV.toString();
						if( s.indexOf(".") > -1 ){
							var length = s.split(".")[1].length;
							if( length < pointLength ){
								totalData[json.id] = s + "0".repeat(pointLength-length);
							}else{
								totalData[json.id] = s;
							}
						}else{
							totalData[json.id] = s +"."+ "0".repeat(pointLength)
						}
					}else{
						totalData[json.id] = tmpV.toString();
					}
					column.td.set("text", totalData[json.id] );
				}
			}.bind(this));
			data.total = totalData;
			return totalData;
		},

		isShowSectionKey: function(){
			return this.json.showSectionKey && this.isMergeRead ;
		},
		isShowSectionBy: function(){
			return this.json.showSectionBy && this.isShowAllSection ;
		},
		isSectionData: function(){ //数据是否经过区段处理
			var data = this.getBusinessDataById();
			if( o2.typeOf( data ) === "object" ){
				var keys = Object.keys(data);
				for( var i=0; i<keys.length; i++ ){
					var key = keys[i];
					if( key !== "data" && key !== "total" ){
						if( o2.typeOf(data[key]) === "object" && o2.typeOf(data[key].data) === "array" ){
							return true;
						}
					}
				}
			}
			return false;
		},
		getAllSectionData: function(){
			var bData = this.getBusinessDataById();
			var flag = false;
			if( !bData ){
				flag = true;
				bData = {};
			}
			if( !bData[this.sectionBy] ){
				flag = true;
				this.isNew = true;
				bData[this.sectionBy] = this.getValue();
			}

			if( flag )this.setBusinessDataById( bData );
			this.dataWithSectionBy = this.getAllSortedSectionData();
			return flag ? this.getBusinessDataById() : bData;
		},
		getAllSortedSectionData: function(){ //获取合并排序后的数据
			var data = this.getBusinessDataById();
			var array = [];
			for( var key in data ){
				if( !["data","total"].contains(key) )array.push({
					sectionKey: key,
					key: key,
					data: data[key]
				})
			}
			if( this.json.sectionDisplaySortScript && this.json.sectionDisplaySortScript.code){
				array.sort( function(a, b){
					this.form.Macro.environment.event = {
						"a": a,
						"b": b
					};
					var flag = this.form.Macro.exec(this.json.sectionDisplaySortScript.code, this);
					this.form.Macro.environment.event = null;
					return flag;
				}.bind(this))
			}
			return array;
		},
		setAllSectionData: function(data, fireChange){
			// if( typeOf( data ) === "object" && typeOf(data.data) === "array"  ){
			var old;
			if(fireChange)old = Object.clone(this.getBusinessDataById() || {});

			//删除并没有用，因为会对比数据提交，如果要清空可以给data.data = []; data.total = {}
			// if( data && data.data )delete data.data;
			// if( data && data.total )delete data.total;

			this.setBusinessDataById(data);
			this.data = data;

			if (this.data){
				this.clearSubModules();
			}

			if (fireChange && JSON.stringify(old) !== JSON.stringify(data)) this.fireEvent("change");

			this.lineList = [];
			this.sectionlineList = [];
			this._loadDatatable();
		},
		getSortedSectionData: function(){ //获取合并排序后的数据
			var data = this.getBusinessDataById();
			var array = [];
			for( var key in data ){
				if( !["data","total"].contains(key) )array.push({
					sectionKey: key,
					key: key,
					data: data[key]
				});
			}
			if( this.json.sectionMergeSortScript && this.json.sectionMergeSortScript.code){
				array.sort( function(a, b){
					this.form.Macro.environment.event = {
						"a": a,
						"b": b
					};
					var flag = this.form.Macro.exec(this.json.sectionMergeSortScript.code, this);
					this.form.Macro.environment.event = null;
					return flag;
				}.bind(this))
			}
			return array;
		},
		getSectionMergeReadData: function(){
			switch (this.json.mergeTypeRead) {
				case "dataScript":
					if (this.json.sectionMergeReadDataScript && this.json.sectionMergeReadDataScript.code) {
						return this.form.Macro.exec(this.json.sectionMergeReadDataScript.code, this);
					}else{
						return {"data":[]};
					}
				default:
					var sortedData = this.getSortedSectionData();
					if( this.json.showSectionKey ){
						this.dataWithSectionKey = sortedData;
					}
					var data = [];
					//把区段值放在每行的数据里
					sortedData.each(function(d){
						( d.data.data || [] ).each(function( obj ){
							if( o2.typeOf(obj) === "object" ){
								// obj.sectionKey = d.sectionKey;
								data.push( obj )
							}
						});
						// data = data.concat( d.data.data );
					});
					return { "data": data };
			}
		},

		_createLineNode: function(){
			var tr;
			if( this.totalTr ){
				tr = new Element("tr").inject(this.totalTr, "before");
			}else{
				tr = new Element("tr").inject(this.tBody || this.table);
			}
			return tr;
		},
		_checkAddAction: function(){
		},
		_loadStyles: function(){
			if (this.json.border) {
				this.table.setStyles({
					"border-top": this.json.border,
					"border-left": this.json.border
				});
			}
			if( this.json.recoveryStyles ){
				this.node.setStyles(this.json.recoveryStyles);
			}
			this.node.setStyles(this.json.styles);
			this.table.setStyles(this.json.tableStyles);
			this.table.set(this.json.properties);
		},
		getDefaultValue: function(){
			var value;
			if (this.json.defaultData && this.json.defaultData.code) value = this.form.Macro.exec(this.json.defaultData.code, this);
			if (value && !value.then) if (o2.typeOf(value)==="array") value = {"data": value || [], "total":{}};
			if(!value && this.multiEditMode){
				value = {"data": [], "total":{}};
				var count = this.json.defaultCount ? this.json.defaultCount.toInt() : 0;
				for( var i=0; i<count; i++ ){
					value.data.push({})
				}
			}
			return value;
		},
		_getValue: function(){
			if (this.moduleValueAG) return this.moduleValueAG;
			var value = this._getBusinessData();
			if (!value){
				value = this.getDefaultValue();
			}
			return value || {"data": [], "total":{}};
		},
		getValue: function(){
			return this._getValue();
		},

		_setValue: function(value){
			if (!!value && o2.typeOf(value.then)=="function"){
				var p = o2.promiseAll(value).then(function(v){
					this.__setValue(v);
				}.bind(this), function(){});
				this.moduleValueAG = p;
				p.then(function(){
					this.moduleValueAG = null;
				}.bind(this), function(){
					this.moduleValueAG = null;
				}.bind(this));
			}else{
				this.moduleValueAG = null;
				this.__setValue(value);
			}
		},
		__setValue: function(value){
			this._setBusinessData(value);
			this.moduleValueAG = null;
			return value;
		},

		_loadDatatable: function(callback){
			var p = o2.promiseAll(this.data).then(function(v){
				this.data = v;

				if( this.isShowAllSection ){
					this._loadSectionLineList_EditSection(function(){
						this._checkAddAction();
						this._loadTotal();
						if(callback)callback();
					}.bind(this))
				}else if( this.isShowSectionKey() ){
					this._loadSectionLineList(function(){
						this._checkAddAction();
						this._loadTotal();
						if(callback)callback();
					}.bind(this))
				}else{
					this._loadLineList(function(){
						this._checkAddAction();
						this._loadTotal();
						if(callback)callback();
					}.bind(this));
				}

				this.moduleValueAG = null;
				return v;
			}.bind(this), function(){
				this.moduleValueAG = null;
			}.bind(this));
			this.moduleValueAG = p;
			if (this.moduleValueAG) this.moduleValueAG.then(function(){
				this.moduleValueAG = null;
			}.bind(this), function(){
				this.moduleValueAG = null;
			}.bind(this));
		},
		_loadSectionLineList_EditSection: function(callback){
			this.getAllSectionData();
			this.dataWithSectionBy.each(function(data, idx){
				var isEdited = false;
				if( this.isSectionLineEditable( data ) && this.editable ){
					isEdited = true;
				}
				var isNew = false;
				var node = this._createLineNode();
				var sectionLine = this._loadSectionLine_EditSection(node, data, idx, isEdited, isNew );
				if( this.sectionBy && this.sectionBy === data.sectionKey ){
					this.sectionLineEdited = sectionLine;
				}
				this.sectionlineList.push(sectionLine);
			}.bind(this))
			if (callback) callback();
		},
		_loadSectionLine_EditSection: function(container, data, index, isEdited, isNew){
			var sectionLine = new MWF.xApplication.process.Xform.DatatablePC.SectionLine(container, this, data, {
				index : index,
				indexText : (index+1).toString(),
				isNew: isNew,
				isEdited: typeOf(isEdited) === "boolean" ? isEdited : this.editable,
				isEditable: this.editable && this.isSectionLineEditable(data),
				isDeleteable: this.deleteable && this.isSectionLineEditable(data),
				isAddable: this.addable && this.isSectionLineEditable(data)
			});
			// this.fireEvent("beforeLoadLine", [line]);
			sectionLine.load();
			// this.fireEvent("afterLoadLine", [line]);
			return sectionLine;
		},
		isSectionLineEditable: function(data){
			return this.isShowAllSection && this.sectionBy && this.sectionBy === data.sectionKey;
		},

		_loadSectionLineList: function(callback){
			this.dataWithSectionKey.each(function(data, idx){
				var isEdited = false;
				var isNew = false;
				var node = this._createLineNode();
				var sectionLine = this._loadSectionLine(node, data, idx, isEdited, isNew );
				this.sectionlineList.push(sectionLine);
			}.bind(this))
			if (callback) callback();
		},
		_loadSectionLine: function(container, data, index, isEdited, isNew){
			var sectionLine = new MWF.xApplication.process.Xform.DatatablePC.SectionLine(container, this, data, {
				index : index,
				indexText : (index+1).toString(),
				isNew: isNew,
				isEdited: typeOf(isEdited) === "boolean" ? isEdited : this.editable,
				isEditable: this.editable,
				isDeleteable: this.deleteable,
				isAddable: this.addable,
				isMergeRead: this.isMergeRead
			});
			// this.fireEvent("beforeLoadLine", [line]);
			sectionLine.load();
			// this.fireEvent("afterLoadLine", [line]);
			return sectionLine;
		},

		_loadLineList: function(callback){
			this.data.data.each(function(data, idx){
				if( !data )return;
				var isNew = this.isNew || (o2.typeOf(this.newLineIndex) === "number" ? idx === this.newLineIndex : false);
				var isEdited = (!this.multiEditMode && o2.typeOf(this.newLineIndex) === "number") ? idx === this.newLineIndex : this.multiEditMode;
				var node = this._createLineNode();
				var line = this._loadLine(node, data, idx, isEdited, isNew );
				this.lineList.push(line);
			}.bind(this));
			this.isNew = false;
			this.newLineIndex = null;
			if (callback) callback();
		},
		isMax : function(){
			var maxCount = this.json.maxCount ? this.json.maxCount.toInt() : 0;
			if( this.editable && maxCount > 0 ) {
				if( this.isShowAllSection ){
					if( this.sectionLineEdited && this.sectionLineEdited.lineList.length >= maxCount )return true;
				}else{
					if( this.lineList.length >= maxCount )return true;
				}
			}
			return false;
		},
		isMin : function(){
			var minCount = this.json.minCount ? this.json.minCount.toInt() : 0;
			if( this.editable && minCount > 0 ) {
				if( this.isShowAllSection ){
					if( this.sectionLineEdited && this.sectionLineEdited.lineList.length <= minCount )return true;
				}else {
					if (this.lineList.length <= minCount) return true;
				}
			}
			return false;
		},
		_loadLine: function(container, data, index, isEdited, isNew){
			var line = new MWF.xApplication.process.Xform.DatatablePC.Line(container, this, data, {
				index : index,
				indexText : (index+1).toString(),
				isNew: isNew,
				isEdited: typeOf(isEdited) === "boolean" ? isEdited : this.editable,
				isEditable: this.editable,
				isDeleteable: this.deleteable,
				isAddable: this.addable,
				isMergeRead: this.isMergeRead
			});
			this.fireEvent("beforeLoadLine", [line]);
			line.load();
			this.fireEvent("afterLoadLine", [line]);
			return line;
		},
		_setLineData: function(line, d){
			if( line.sectionLine ){
				var data = this.getBusinessDataById();
				var sdata = data[ line.sectionLine.sectionKey ];
				if( sdata && sdata.data ){
					sdata.data[line.options.indexInSectionLine] = d;
					this.setAllSectionData( data );
				}
			}else{
				var index = line.options.index;
				var data = this.getInputData();
				data.data[index] = d;
				this.setData( data );
			}
		},
		_addLine: function(ev, edited, d){
			if( !this._completeLineEdit(ev, true) )return;
			if( this.isMax() ){
				var text = MWF.xApplication.process.Xform.LP.maxItemCountNotice.replace("{n}",this.json.maxCount);
				this.form.notice(text,"info");
				return false;
			}

			var data, index, line;
			if( this.isShowAllSection ){
				data = this.getBusinessDataById();
				var sdata = data[ this.sectionBy ];
				if( !sdata ){
					sdata = data[ this.sectionBy ] = { data: [] };
				}
				index = sdata.data.length;

				// if( d && !d.sectionKey )d.sectionKey = this.sectionBy;
				// sectionKey: this.sectionBy
				sdata.data.push(d||{});
				this.newLineIndex = index;

				this.setAllSectionData( data );
				line = this.sectionLineEdited.lineList[index];
				line.isNewAdd = true;
			}else{
				index = this.lineList.length;
				data = this.getInputData();

				data.data.push(d||{});
				this.newLineIndex = index;

				this.setData( data );
				line = this.getLine(index);
				line.isNewAdd = true;
			}


			this.validationMode();
			this.fireEvent("addLine", [{"line":line, "ev":ev}]);

			this.fireEvent("change", [{"lines":[line], "type":"addline"}]);

			return line;
		},
		_insertLine: function(ev, beforeLine){
			if( !this._completeLineEdit(ev, true) )return;
			if( this.isMax() ){
				var text = MWF.xApplication.process.Xform.LP.maxItemCountNotice.replace("{n}",this.json.maxCount);
				this.form.notice(text,"info");
				return false;
			}

			//使用数据驱动
			var data, index, line;
			if( this.isShowAllSection ){
				index = beforeLine.options.indexInSectionLine + 1;

				data = this.getBusinessDataById();
				var sdata = data[ this.sectionBy ];
				if( !sdata ){
					sdata = data[ this.sectionBy ] = { data: [] };
				}
				sdata.data.splice(index, 0, {});
				this.newLineIndex = index;

				this.setAllSectionData( data );
				line = this.sectionLineEdited.lineList[index];
				line.isNewAdd = true;
			}else {
				index = beforeLine.options.index + 1;

				data = this.getInputData();
				data.data.splice(index, 0, {});
				this.newLineIndex = index;
				this.setData(data);
				line = this.getLine(index);
				line.isNewAdd = true;
			}

			this.validationMode();
			this.fireEvent("addLine",[{"line":line, "ev":ev}]);
			this.fireEvent("change", [{"lines":[line], "type":"addline"}]);
			return line;
		},
		_insertLineByIndex: function(ev, index, d){
			if( !this._completeLineEdit(ev, true) )return;
			if( this.isMax() ){
				var text = MWF.xApplication.process.Xform.LP.maxItemCountNotice.replace("{n}",this.json.maxCount);
				this.form.notice(text,"info");
				return false;
			}

			var data, line;
			if( this.isShowAllSection ){
				data = this.getBusinessDataById();
				var sdata = data[ this.sectionBy ];
				if( !sdata ){
					sdata = data[ this.sectionBy ] = { data: [] };
				}
				if (sdata.data.length < index) return null;
				sdata.data.splice(index, 0, d || {});
				this.newLineIndex = index;

				this.setAllSectionData( data );
				line = this.sectionLineEdited.lineList[index];
				line.isNewAdd = true;
			}else {
				//使用数据驱动
				data = this.getInputData();
				if (data.data.length < index) return null;
				data.data.splice(index, 0, d || {});
				this.setData(data);
				line = this.getLine(index);
				line.isNewAdd = true;
			}

			this.validationMode();
			this.fireEvent("addLine",[{"line":line, "ev":ev}]);
			this.fireEvent("change", [{"lines":[line], "type":"addline"}]);
			return line;
		},
		_deleteSelectedLine: function(ev){
			var selectedLine = this.lineList.filter(function (line) { return line.selected; });
			if( selectedLine.length === 0 ){
				this.form.notice( MWF.xApplication.process.Xform.LP.selectItemNotice,"info");
				return false;
			}
			var minCount = this.json.minCount ? this.json.minCount.toInt() : 0;
			if( minCount > 0 ){
				if( this.lineList.length - selectedLine.length < minCount ){
					var text = MWF.xApplication.process.Xform.LP.minItemNotice.replace("{n}", minCount );
					this.form.notice(text,"info");
					return false;
				}
			}
			var _self = this;
			this.form.confirm("warn", ev, MWF.xApplication.process.Xform.LP.deleteDatagridLineTitle, MWF.xApplication.process.Xform.LP.deleteSelectedItemNotice, 300, 120, function(){

				_self._delLines( selectedLine );

				this.close();

			}, function(){
				this.close();
			}, null, null, this.form.json.confirmStyle);

		},
		_delLines: function(lines){
			var _self = this;
			var saveFlag = false;

			var data;
			if( this.isShowAllSection ){
				data = this.getBusinessDataById();
			}else{
				data = _self.getInputData();
			}

			lines.reverse().each(function(line){
				_self.fireEvent("deleteLine", [line]);

				if(line.deleteAttachment())saveFlag = true;

				if( line.sectionLine ){
					var d = data[ line.sectionLine.sectionKey ];
					if( d && d.data ){
						d.data.splice(line.options.indexInSectionLine, 1);
						if(this.currentEditedLine === line)this.currentEditedLine = null;
					}
				}else {
					data.data.splice(line.options.index, 1);
					if (this.currentEditedLine === line) this.currentEditedLine = null;
				}

				_self.fireEvent("afterDeleteLine");
			});

			if( this.isShowAllSection ){
				_self.setAllSectionData(data);
			}else{
				_self.setData( data );
			}
			this.validationMode();

			_self.fireEvent("change", [{"lines":lines, "type":"deletelines"}]);

			if(saveFlag)this.form.saveFormData();
		},
		_deleteLine: function(ev, line){
			if( this.isMin() ){
				var text = MWF.xApplication.process.Xform.LP.minItemCountNotice.replace("{n}", this.json.minCount );
				this.form.notice(text,"info");
				return false;
			}
			var _self = this;
			this.form.confirm("warn", ev, MWF.xApplication.process.Xform.LP.deleteDatagridLineTitle, MWF.xApplication.process.Xform.LP.deleteDatagridLine, 300, 120, function(){
				_self._delLine(line);
				this.close();
			}, function(){
				this.close();
			}, null, null, this.form.json.confirmStyle);
		},
		_delLine: function(line){
			this.fireEvent("deleteLine", [line]);

			var saveFlag = line.deleteAttachment();
			//使用数据驱动
			var data;
			if( line.sectionLine ){
				var data = this.getBusinessDataById();
				var d = data[ line.sectionLine.sectionKey ];
				if( d && d.data ){
					d.data.splice(line.options.indexInSectionLine, 1);
				}
				if(this.currentEditedLine === line)this.currentEditedLine = null;
				this.setAllSectionData( data );
			}else{
				data = this.getInputData();
				data.data.splice(line.options.index, 1);

				if(this.currentEditedLine === line)this.currentEditedLine = null;
				this.setData( data );
			}

			this.validationMode();
			this.fireEvent("afterDeleteLine");

			this.fireEvent("change", [{"lines":[line], "type":"deleteline"}]);

			if(saveFlag)this.form.saveFormData();
		},
		_cancelLineEdit: function(){
			var line = this.currentEditedLine;
			if( !line )return true;
			line.validationMode();
			if( line.isNewAdd ){
				// var saveFlag = line.deleteAttachment();
				this._delLine( line );
				this.currentEditedLine = null;
				// if(saveFlag)this.form.saveFormData();
			}else{
				// line.data = Object.clone(line.getOriginalDataWithCheckAttachment());
				line.resetDataWithOriginalData();
				line.changeEditMode(false);
				this._loadTotal();
				if( line.sectionLine )line.sectionLine._loadTotal();
				if(line.attachmentChangeFlag){
					this.form.saveFormData();
					line.attachmentChangeFlag = false;
				}
				this.currentEditedLine = null;
				this.fireEvent("cancelLineEdit", [line]);
			}
			return true;
		},
		_completeLineEdit: function( ev, fireChange, ignoerSave ){
			var line = this.currentEditedLine;
			if( !line )return true;
			if( !line.validation() )return false;

			var originalDataStr, dataStr;
			if( fireChange ){
				if( line.originalData && o2.typeOf(line.originalData) === "object"){
					originalDataStr = JSON.stringify(line.originalData)
				}
				dataStr = JSON.stringify(line.data);
			}

			line.isNewAdd = false;
			// line.data = line.getData();
			line.computeModuleData("save");
			line.originalData = Object.clone(line.data);
			line.changeEditMode(false);
			this._loadTotal();
			if( line.sectionLine )line.sectionLine._loadTotal();
			if(line.attachmentChangeFlag && !ignoerSave){
				this.form.saveFormData();
				line.attachmentChangeFlag = false;
			}
			this.currentEditedLine = null;
			this.validationMode();
			this.fireEvent("completeLineEdit", [line]);
			if( fireChange && originalDataStr !== dataStr ){
				this.fireEvent("change", [{"lines":[line], "type":"editcomplete"}]);
			}
			return true;
		},
		_moveUpLine: function(ev, line){
			if( this.currentEditedLine && !this._completeLineEdit(null, true) )return false;

			var data, upData, curData;
			if( this.isShowAllSection ){
				if (line.options.indexInSectionLine === 0) return;

				data = this.getBusinessDataById();
				var sdata = data[ this.sectionBy ];
				if( !sdata )return;

				upData = sdata.data[line.options.indexInSectionLine - 1];
				curData = sdata.data[line.options.indexInSectionLine];
				sdata.data[line.options.indexInSectionLine] = upData;
				sdata.data[line.options.indexInSectionLine - 1] = curData;

				this.setAllSectionData( data );
			}else {
				if (line.options.index === 0) return;

				data = this.getInputData();
				upData = data.data[line.options.index - 1];
				curData = data.data[line.options.index];
				data.data[line.options.index] = upData;
				data.data[line.options.index - 1] = curData;
				this.setData(data);
			}
			this.fireEvent("change", [{lines: this.lineList, "type":"move"}]);
		},
		_changeEditedLine: function(line){
			if( this.currentEditedLine ){
				if( line ===  this.currentEditedLine )return;
				if( !this._completeLineEdit( null,true ) )return;
			}
			line.changeEditMode(true);

			/**
			 * 数据表格当前正在编辑的条目，当数据表格为“同时编辑多行”时无此属性。
			 * @member {MWF.xApplication.process.Xform.DatatablePC.Line | MWF.xApplication.process.Xform.DatatableMobile.Line | Null}
			 * @example
			 * //获取数据表格“dt1”的正在编辑的条目。
			 * var line = this.form.get("dt1").currentEditedLine;
			 * //获取数据
			 * var data = line.getData();
			 * //设置数据
			 * line.setData({"subject":"111"});
			 * //获取subject字段的值
			 * var data = line.get("subject").getData();
			 * //设置subject字段的值
			 * line.get("subject").setData("test1");
			 */
			this.currentEditedLine = line;
		},

		editValidation: function(){
			var flag = true;
			this.editModules.each(function(field, key){
				if (field.json.type!=="sequence" && field.validationMode ){
					field.validationMode();
					if (!field.validation()) flag = false;
				}
			}.bind(this));
			return flag;
		},


		_afterLoaded: function(){
		},
		// /**
		//  * @summary 重置数据表格的值为默认值或置空。
		//  *  @example
		//  * this.form.get('fieldId').resetData();
		//  */
		resetData: function(){
			//var value = this.getDefaultValue() || {"data": [], "total":{}};
			var value = this.getValue();
			this.setData( value );
		},
		/**当参数为Promise的时候，请查看文档: {@link  https://www.yuque.com/o2oa/ixsnyt/ws07m0|使用Promise处理表单异步}<br/>
		 * 当表单上没有对应组件的时候，可以使用this.data[fieldId] = data赋值。
		 * @summary 为数据表格赋值。
		 * @param data{DatatableData|Promise|Array} 必选，数组或Promise.
		 * @param fireChange{boolean} 可选，是否触发change事件，默认false.
		 * @example
		 *  this.form.get("fieldId").setData([]); //赋空值
		 * @example
		 *  //如果无法确定表单上是否有组件，需要判断
		 *  if( this.form.get('fieldId') ){ //判断表单是否有无对应组件
		 *      this.form.get('fieldId').setData( data );
		 *  }else{
		 *      this.data['fieldId'] = data;
		 *  }
		 *@example
		 *  //使用Promise
		 *  var field = this.form.get("fieldId");
		 *  var promise = new Promise(function(resolve, reject){ //发起异步请求
		 *    var oReq = new XMLHttpRequest();
		 *    oReq.addEventListener("load", function(){ //绑定load事件
		 *      resolve(oReq.responseText);
		 *    });
		 *    oReq.open("GET", "/data.json"); //假设数据存放在data.json
		 *    oReq.send();
		 *  });
		 *  promise.then( function(){
		 *    var data = field.getData(); //此时由于异步请求已经执行完毕，getData方法获得data.json的值
		 * })
		 *  field.setData( promise );
		 */
		setData: function(data, fireChange){
			if (!data){
				data = this._getValue();
			}else{
				//todo 计算total
			}
			this._setData(data, fireChange);
		},
		_setData: function(data, fireChange){
			var p = o2.promiseAll(this.data).then(function(v){
				this.data = v;
				// if (o2.typeOf(data)==="object") data = [data];
				this.__setData(data, fireChange);
				this.moduleValueAG = null;
				return v;
			}.bind(this), function(){
				this.moduleValueAG = null;
			}.bind(this));
			this.moduleValueAG = p;
			if (this.moduleValueAG) this.moduleValueAG.then(function(){
				this.moduleValueAG = null;
			}.bind(this), function(){
				this.moduleValueAG = null;
			}.bind(this));
		},
		__setData: function(data, fireChange){
			// if( typeOf( data ) === "object" && typeOf(data.data) === "array"  ){
			var old;
			if(fireChange)old = Object.clone(this._getBusinessData() || {});

			this._setBusinessData(data);
			this.data = data;

			if (this.data){
				this.clearSubModules();
			}

			if (fireChange && JSON.stringify(old) !== JSON.stringify(data)) this.fireEvent("change");

			this.lineList = [];
			this.sectionlineList = [];
			this._loadDatatable();
		},
		clearSubModules: function(){
			if( this.sectionlineList && this.sectionlineList.length ){
				for( var i=0; i<this.sectionlineList.length; i++ ){
					this.sectionlineList[i].clearSubModules();
				}
			}else{
				for (var i=0; i<this.lineList.length; i++){
					this.lineList[i].clearSubModules();
				}
			}
		},
		/**
		 * @summary 判断数据表格是否为空.
		 * @example
		 * if( this.form.get('fieldId').isEmpty() ){
		 *     this.form.notice('至少需要添加一条数据', 'warn');
		 * }
		 * @return {Boolean} 是否为空
		 */
		isEmpty: function(){
			var data = this.getInputData();
			if( !data || !data.data )return true;
			if( o2.typeOf( data.data ) === "array" ){
				return data.data.length === 0;
			}
			//????
			// if( o2.typeOf( data ) === "object" ){
			// 	return Object.keys(data).length === 0;
			// }
			return false;
		},
		//api 相关开始
		/**
		 * 获取对应的条目。
		 * @param {Number} index 条目序号，从零开始
		 * @return {MWF.xApplication.process.Xform.DatatablePC.Line | Null} 对应的数据表格条目
		 * @example
		 * //获取数据表格“dt1”的第一个条目。
		 * var line = this.form.get("dt1").getLine(0);
		 * //获取第一行的数据
		 * var data = line.getData();
		 * //设置第一行的数据
		 * line.setData({"subject":"111"});
		 * //获取第一个条目subject字段的值
		 * var data = line.get("subject").getData();
		 * //设置subject字段的值
		 * line.get("subject").setData("test1");
		 */
		getLine: function(index){
			var line = this.lineList[index];
			return line || null;
		},
		/**
		 * 在数据表格末尾添加条目。
		 * @param {Object} [data] 添加条目的数据。
		 * @return {MWF.xApplication.process.Xform.DatatablePC.Line} 添加的数据表格条目
		 * @example
		 * var line = this.form.get("dt1").addLine();
		 */
		addLine: function( data ){
			return this._addLine( null, null,  data );
		},
		/**
		 * 在数据表格指定位置添加条目。
		 * @param {Number} index 条目序号，从零开始，如果下标超过当前数据表格条目数，插入失败并返回null。
		 * @param {Object} [data] 添加条目的数据。
		 * @return {MWF.xApplication.process.Xform.DatatablePC.Line | Null} 插入的数据表格条目
		 * @example
		 * var line = this.form.get("dt1").insertLine(0);
		 */
		insertLine: function(index, data){
			return this._insertLineByIndex(null,  index, data);
		},
		/**
		 * 删除指定位置的条目。
		 * @param {Number} index 条目序号，从零开始，如果下标超过当前数据表格条目数，删除失败。
		 * @example
		 * //直接删除第一个条目
		 * this.form.get("dt1").deleteLine(0);
		 */
		deleteLine: function(index, ev){
			var line = this.lineList[index];
			if( !line )return null;
			// if( ev ){
			// 	this._deleteLine(ev, line);
			// }else{
			this._delLine(line);
			// }
		},
		/**
		 * 获取对应表单组件，作用等同于get。
		 * @param {Number} index 条目序号，从零开始
		 * @param {String} id 组件标识
		 * @return {FormComponent} 对应表单组件
		 * @example
		 * //获取数据表格“dt1”的第一个条目的subject字段。
		 * var module = this.form.get("dt1").getModule(0, "subject");
		 * //获取subject字段的值
		 * var data = module.getData();
		 * //设置subject字段的值
		 * module.setData("test1");
		 */
		getModule: function(index, id){
			var line = this.lineList[index];
			if( !line )return null;
			return line.getModule(id);
		},
		/**
		 * 获取对应表单组件，作用等同于getModule。
		 * @param {Number} index 条目序号，从零开始
		 * @param {String} id 组件标识
		 * @return {FormComponent} 对应表单组件
		 * @example
		 * //获取数据表格“dt1”的第一个条目的subject字段。
		 * var module = this.form.get("dt1").get(0, "subject");
		 * //获取subject字段的值
		 * var data = module.getData();
		 * //设置subject字段的值
		 * module.setData("test1");
		 */
		get: function(index, id){
			return this.getModule(index, id);
		},
		//api 相关

		/**
		 * 在脚本中使用 this.data[fieldId] 也可以获取组件值。
		 * 区别如下：<br/>
		 * 1、当使用Promise的时候<br/>
		 * 使用异步函数生成器（Promise）为组件赋值的时候，用getData方法立即获取数据，可能返回修改前的值，当Promise执行完成以后，会返回修改后的值。<br/>
		 * this.data[fieldId] 立即获取数据，可能获取到异步函数生成器，当Promise执行完成以后，会返回修改后的值。<br/>
		 * {@link https://www.yuque.com/o2oa/ixsnyt/ws07m0#EggIl|具体差异请查看链接}<br/>
		 * 2、当表单上没有对应组件的时候，可以使用this.data[fieldId]获取值，但是this.form.get('fieldId')无法获取到组件。
		 * @summary 获取数据表格数据.
		 * @example
		 * var data = this.form.get('fieldId').getData();
		 *@example
		 *  //如果无法确定表单上是否有组件，需要判断
		 *  var data;
		 *  if( this.form.get('fieldId') ){ //判断表单是否有无对应组件
		 *      data = this.form.get('fieldId').getData();
		 *  }else{
		 *      data = this.data['fieldId']; //直接从数据中获取字段值
		 *  }
		 *  @example
		 *  //使用Promise
		 *  var field = this.form.get("fieldId");
		 *  var promise = new Promise(function(resolve, reject){ //发起异步请求
		 *    var oReq = new XMLHttpRequest();
		 *    oReq.addEventListener("load", function(){ //绑定load事件
		 *      resolve(oReq.responseText);
		 *    });
		 *    oReq.open("GET", "/data.json"); //假设数据存放在data.json
		 *    oReq.send();
		 *  });
		 *  promise.then( function(){
		 *    var data = field.getData(); //此时由于异步请求已经执行完毕，getData方法获得data.json的值
		 * })
		 *  field.setData( promise );
		 * @return {DatatableData}
		 */
		getData: function(){
			if( this.importer ){
				this.importer.destroySimulateModule();
			}
			if (this.editable!==false){
				// this.lineList.each(function(line, index){
				// 	if( !this.multiEditMode && line.options.isEdited ){
				// 		line.data = line.getData();
				// 	}else{
				// 		line.data = line.getData();
				// 	}
				// });
				if( this.multiEditMode){
					this.lineList.each(function (line) {
						line.computeModuleData("save");
					})
				}
				return this._getBusinessData();
			}else{
				return this._getBusinessData();
			}
		},
		getInputData: function(){
			if( this.importer ){
				this.importer.destroySimulateModule();
			}
			if (this.editable!==false){
				return this._getBusinessData();
			}else{
				return this._getBusinessData();
			}
		},
		//区段依据
		_getSectionBy: function(){
			if (this.json.section!=="yes"){
				return "";
			}else {
				switch (this.json.sectionBy){
					case "person":
						return layout.desktop.session.user.id;
					case "unit":
						return (this.form.businessData.task) ? this.form.businessData.task.unit : "";
					case "activity":
						return (this.form.businessData.work) ? this.form.businessData.work.activity : "";
					case "splitValue":
						return (this.form.businessData.work) ? this.form.businessData.work.splitValue : "";
					case "script":
						if( this.json.sectionByScript && this.json.sectionByScript.code){
							return this.form.Macro.exec(this.json.sectionByScript.code, this) || "";
						}else{
							return "";
						}
					default:
						return "";
				}
			}
		},
		createErrorNode: function(text){
			var node = new Element("div");
			var iconNode = new Element("div", {
				"styles": {
					"width": "20px",
					"height": "20px",
					"float": "left",
					"background": "url("+"../x_component_process_Xform/$Form/default/icon/error.png) center center no-repeat"
				}
			}).inject(node);
			var textNode = new Element("div", {
				"styles": {
					"line-height": "20px",
					"margin-left": "20px",
					"color": "red",
					"word-break": "keep-all"
				},
				"text": text
			}).inject(node);
			return node;
		},
		notValidationMode: function(text){
			if (!this.isNotValidationMode){
				this.isNotValidationMode = true;
				this.node.store("borderStyle", this.node.getStyles("border-left", "border-right", "border-top", "border-bottom"));
				this.node.setStyle("border", "1px solid red");

				this.errNode = this.createErrorNode(text).inject(this.node, "after");
				this.showNotValidationMode(this.node);

				var parentNode = this.errNode;
				while( parentNode.offsetParent === null ){
					parentNode = parentNode.getParent();
				}

				if (!parentNode.isIntoView()) parentNode.scrollIntoView(false);
			}
		},
		showNotValidationMode: function(node){
			var p = node.getParent("div");
			if (p){
				if (p.get("MWFtype") == "tab$Content"){
					if (p.getParent("div").getStyle("display")=="none"){
						var contentAreaNode = p.getParent("div").getParent("div");
						var tabAreaNode = contentAreaNode.getPrevious("div");
						var idx = contentAreaNode.getChildren().indexOf(p.getParent("div"));
						var tabNode = tabAreaNode.getLast().getFirst().getChildren()[idx];
						tabNode.click();
						p = tabAreaNode.getParent("div");
					}
				}
				this.showNotValidationMode(p);
			}
		},
		validationMode: function(){
			if (this.isNotValidationMode){
				this.isNotValidationMode = false;
				this.node.setStyles(this.node.retrieve("borderStyle"));
				if (this.errNode){
					this.errNode.destroy();
					this.errNode = null;
				}
			}
			this.lineList.each(function(line){
				line.validationMode();
			})
		},

		validationConfigItem: function(routeName, data){
			var flag = (data.status=="all") ? true: (routeName == data.decision);
			if (flag){
				//???
				var n = this.getInputData();
				if( o2.typeOf(n)==="object"){
					var arr = [];
					Object.each( n, function (d, key) {
						if(o2.typeOf(d) === "array")arr = arr.concat(d);
					});
					n = arr;
				}
				var v = (data.valueType=="value") ? n : n.length;
				switch (data.operateor){
					case "isnull":
						if (!v){
							this.notValidationMode(data.prompt);
							return false;
						}
						break;
					case "notnull":
						if (v){
							this.notValidationMode(data.prompt);
							return false;
						}
						break;
					case "gt":
						if (v>data.value){
							this.notValidationMode(data.prompt);
							return false;
						}
						break;
					case "lt":
						if (v<data.value){
							this.notValidationMode(data.prompt);
							return false;
						}
						break;
					case "equal":
						if (v==data.value){
							this.notValidationMode(data.prompt);
							return false;
						}
						break;
					case "neq":
						if (v!=data.value){
							this.notValidationMode(data.prompt);
							return false;
						}
						break;
					case "contain":
						if (v.indexOf(data.value)!=-1){
							this.notValidationMode(data.prompt);
							return false;
						}
						break;
					case "notcontain":
						if (v.indexOf(data.value)==-1){
							this.notValidationMode(data.prompt);
							return false;
						}
						break;
				}
			}
			return true;
		},
		validationConfig: function(routeName, opinion){
			if (this.json.validationConfig){
				if (this.json.validationConfig.length){
					for (var i=0; i<this.json.validationConfig.length; i++) {
						var data = this.json.validationConfig[i];
						if (!this.validationConfigItem(routeName, data)) return false;
					}
				}
				return true;
			}
			return true;
		},
		saveValidation: function () {
			return this.validationCurrentEditedLine();
		},
		validationCurrentEditedLine: function () {
			var line = this.currentEditedLine;
			if( !line )return true;
			if( !line.validation() )return false;
			return true;
		},
		validation: function(routeName, opinion){
			if (this.isEdit){
				if (!this.editValidation()){
					return false;
				}
			}
			if (!this.validationConfig(routeName, opinion))  return false;

			if( !this.validationCurrentEditedLine() )return false;

			if (!this.json.validation) return true;
			if (!this.json.validation.code) return true;

			this.currentRouteName = routeName;
			var flag = this.form.Macro.exec(this.json.validation.code, this);
			this.currentRouteName = "";

			if (!flag) flag = MWF.xApplication.process.Xform.LP.lineNotValidation;
			if (flag.toString()!=="true"){
				this.notValidationMode(flag);
				return false;
			}
			return true;
		},
		getAttachmentRandomSite: function(){
			var i = (new Date()).getTime();
			return this.json.id+i;
		},
		_loadImportExportAction: function(){
			this.impexpNode = this.node.getElement("div.impexpNode");
			if( this.impexpNode )this.impexpNode.destroy();
			this.impexpNode = null;

			if( !this.exportenable && !this.importenable )return;

			var position = ["leftTop","centerTop","rightTop"].contains( this.json.impexpPosition || "" ) ? "top" : "bottom";
			var container = new Element("div").inject(this.node, position);

			this.importExportAreaNode = new Element("div").inject( container );
			if( ["leftTop","leftBottom"].contains( this.json.impexpPosition || "" ) ){
				this.importExportAreaNode.setStyles({ "float" : "left" })
			}else if( ["rightTop","rightBottom"].contains( this.json.impexpPosition || "" ) ){
				this.importExportAreaNode.setStyles({ "float" : "right" })
			}else{
				this.importExportAreaNode.setStyles({ "margin" : "0px auto" })
			}

			if( this.exportenable ){
				this.exportActionNode = new Element("div", {
					text : this.json.exportActionText || MWF.xApplication.process.Xform.LP.datagridExport
				}).inject(this.importExportAreaNode);
				var styles;
				if( this.json.exportActionStyles ){
					styles = this.json.exportActionStyles
				}else{
					styles = this.form.css.gridExportActionStyles;
				}
				this.exportActionNode.setStyles(styles);

				this.exportActionNode.addEvent("click", function () {
					this.exportToExcel();
				}.bind(this))
			}

			if( this.importenable ){
				this.importActionNode = new Element("div", {
					text : this.json.importActionText || MWF.xApplication.process.Xform.LP.datagridImport
				}).inject(this.importExportAreaNode);
				var styles;
				if( this.json.importActionStyles ){
					styles = this.json.importActionStyles;
				}else{
					styles = this.form.css.gridImportActionStyles;
				}
				this.importActionNode.setStyles(styles);

				this.importActionNode.addEvent("click", function () {
					this.importFromExcel();
				}.bind(this))
			}

			if( ["centerTop","centerBottom"].contains( this.json.impexpPosition ) ){
				var width = 2;

				if( this.exportActionNode ){
					width = width + this.exportActionNode.getSize().x +
						this.exportActionNode.getStyle("padding-left").toFloat() +
						+ this.exportActionNode.getStyle("padding-right").toFloat() +
						+ this.exportActionNode.getStyle("margin-left").toFloat() +
						+ this.exportActionNode.getStyle("margin-right").toFloat()
				}

				if( this.importActionNode ){
					width = width + this.importActionNode.getSize().x +
						this.importActionNode.getStyle("padding-left").toFloat() +
						+ this.importActionNode.getStyle("padding-right").toFloat() +
						+ this.importActionNode.getStyle("margin-left").toFloat() +
						+ this.importActionNode.getStyle("margin-right").toFloat()
				}

				this.importExportAreaNode.setStyle( "width", width+"px" );
			}
		},
		exportToExcel: function(){
			this.exporter = new MWF.xApplication.process.Xform.DatatablePC.Exporter(this);
			this.exporter.exportToExcel();
		},
		importFromExcel: function(){
			this.importer = new MWF.xApplication.process.Xform.DatatablePC.Importer(this);
			this.importer.importFromExcel();
		}
	});

MWF.xApplication.process.Xform.DatatablePC$Title = new Class({
	Extends: MWF.APP$Module,
	_loadUserInterface: function(){
		if(this.json.recoveryStyles){
			this.node.setStyles(this.json.recoveryStyles);
		}
		if (this.json.prefixIcon || this.json.suffixIcon){
			var text = this.node.get("text");
			this.node.empty();

			var height = (this.node.offsetParent === null) ? "28" : (this.node.getSize().y - this.getOffsetY());
            this.wrapNode = new Element("div", {
                "styles": {
                    "position":"relative",
                    "display":"inline-block",
                    "height": height,
                    "line-height": height
                }
            }).inject(this.node);

			this.textNode = new Element("div", {"styles": {
				"padding-left": (this.json.prefixIcon) ? "20px" : "0px",
				"padding-right": (this.json.suffixIcon) ? "20px" : "0px"
			}, "text": text}).inject(this.wrapNode);

			var  textHeight = (this.node.offsetParent === null) ? "28" : this.textNode.getSize().y;
			if (this.json.prefixIcon){
				this.prefixNode = new Element("div", {"styles": {
					"position": "absolute",
					"top": "0px",
					"left": "0px",
					"width": "20px",
					"height": ""+ textHeight +"px",
					"background": "url("+this.json.prefixIcon+") center center no-repeat"
				}}).inject(this.textNode, "before");
			}
			if (this.json.suffixIcon){
				this.suffixNode = new Element("div", {"styles": {
					"position": "absolute",
					"top": "0px",
					"right": "0px",
					"width": "20px",
					"height": ""+textHeight+"px",
					"background": "url("+this.json.suffixIcon+") center center no-repeat"
				}}).inject(this.textNode, "before");
			}
		}
	},
	getOffsetY: function(){
		return (this.node.getStyle("padding-top") || 0).toInt()
			+ (this.node.getStyle("padding-bottom") || 0).toInt()
			+ (this.node.getStyle("border-top") || 0).toInt()
			+ (this.node.getStyle("border-bottom") || 0).toInt()
	}
});

MWF.xApplication.process.Xform.DatatablePC$Data =  new Class({
	Extends: MWF.APP$Module,
	_loadUserInterface: function(){
		if(this.json.recoveryStyles){
			this.node.setStyles(this.json.recoveryStyles);
		}
	}
});

MWF.xApplication.process.Xform.DatatablePC.SectionLine =  new Class({
	Implements: [Options, Events],
	options: {
		isNew: false,
		isEdited: true, //是否正在编辑
		isEditable: true, //能否被编辑
		isDeleteable: true, //能否被删除
		isAddable: true, //能否添加
		isMergeRead: false, //合并阅读
		index: 0,
		indexText: "0"
	},
	initialize: function (node, datatable, data, options) {
		this.setOptions(options);
		this.sectionKeyNode = node;
		this.datatable = datatable;
		this.data = data;
		this.form = this.datatable.form;
		this.lineList = [];
		this.totalColumns = [];
		this.totalNumberModuleIds = [];
		this.sectionKey = this.data.sectionKey;
	},
	load: function () {
		if( this.datatable.isShowSectionKey() || this.datatable.isShowSectionBy() ){
			this.loadSectionKeyNode();
		}else{
			this.sectionKeyNode.hide();
		}
		this._loadTotalTr();

		if( this.data.data &&  this.data.data.data ){
			( this.data.data.data || [] ).each(function(d, idx){
				if( !d )return;
				var node = this._createLineNode();
				var isEdited = false, isNew = false;
				if( this.options.isEdited ){
					var dt = this.datatable;
					isNew = dt.isNew || (o2.typeOf(dt.newLineIndex) === "number" ? idx === dt.newLineIndex : false);
					isEdited = (!dt.multiEditMode && o2.typeOf(dt.newLineIndex) === "number") ? idx === dt.newLineIndex : dt.multiEditMode;
					dt.isNew = false;
					dt.newLineIndex = null;
				}
				var line = this._loadLine( node, d, idx, isEdited, isNew );
				this.lineList.push(line);
				this.datatable.lineList.push(line);
			}.bind(this));
			this._loadTotal();
		}
	},
	_loadLine: function(container, data, index, isEdited, isNew){
		var line = new MWF.xApplication.process.Xform.DatatablePC.Line(container, this.datatable, data, {
			indexInSectionLine : index,
			indexInSectionLineText : (index+1).toString(),
			index: this.datatable.lineList.length,
			indexText : (this.datatable.lineList.length + 1).toString(),
			isNew: isNew,
			isEdited: typeOf(isEdited) === "boolean" ? isEdited : this.options.isEdited,
			isEditable: this.options.isEditable,
			isDeleteable: this.options.isDeleteable,
			isAddable: this.options.isAddable,
			isMergeRead: this.options.isMergeRead,
			sectionKey: this.sectionKey
		}, this);
		this.datatable.fireEvent("beforeLoadLine", [line]);
		line.load();
		this.datatable.fireEvent("afterLoadLine", [line]);
		return line;
	},
	_createLineNode: function(){
		var tr;
		if( this.totalTr ){
			tr = new Element("tr").inject(this.totalTr, "before");
		}else{
			tr = this.datatable._createLineNode();
			// tr = new Element("tr").inject(this.tBody || this.table);
		}
		return tr;
	},
	loadSectionKeyNode: function () {
		var sectionKeyStyles = this.datatable._parseStyles(this.datatable.json.sectionKeyStyles);
		var keyNode = new Element("td.mwf_sectionkey", {
			colspan: this.datatable.columnCount,
			styles : sectionKeyStyles
		}).inject( this.sectionKeyNode );
		this.keyNode = keyNode;
		var separator;
		if( this.datatable.isShowSectionKey() ){
			separator = this.datatable.json.keyContentSeparator;
		}else{
			separator = this.datatable.json.keyContentSeparatorSectionBy;
		}
		this.datatable.getSectionKeyWithMerge( this.data, function (key) {
			if( o2.typeOf(key) === "string" ){
				keyNode.set("text", key + (separator || ""));
			}else{
				Promise.resolve(key).then(function (k) {
					keyNode.set("text", k + (separator || ""));
				}.bind(this))
			}
		}.bind(this));
	},
	clearSubModules: function(){
		if( this.keyNode ){
			this.keyNode.destroy();
			this.keyNode = null;
		}
		for (var i=0; i<this.lineList.length; i++){
			this.lineList[i].clearSubModules();
		}
		if( this.totalTr ){
			this.totalTr.destroy();
			this.totalTr = null;
		}
	},
	isTotalTrShow: function(){
		var dt = this.datatable;
		if( dt.isShowSectionKey() && ( dt.json.totalRowBySection || [] ).contains("section") )return true;
		if( dt.isShowSectionBy() && ( dt.json.totalRowBy || [] ).contains("section") )return true;
		return false;
	},
	_loadTotalTr: function(){
		if( !this.datatable.totalFlag )return false;
		this.totalTr = new Element("tr.mwf_totaltr", {"styles": this.form.css.datagridTotalTr_section}).inject(this.sectionKeyNode, "after");
		if( !this.isTotalTrShow() )this.totalTr.hide();
		var ths = this.datatable.titleTr.getElements("th");
		//datatable$Title Module
		ths.each(function(th, index){
			var td = new Element("td", {"text": "", "styles": this.form.css.datagridTotalTd}).inject(this.totalTr);
			if (this.datatable.json.sectionAmountStyles) td.setStyles(this.datatable.json.sectionAmountStyles);

			var json = this.form._getDomjson(th);
			if (json){
				if( json.isShow === false ){
					td.hide(); //隐藏列
				}else if( this.reloading && json.isShow === true){
					td.setStyle("display", "");
				}
				if ((json.total === "number") || (json.total === "count")){
					this.totalColumns.push({
						"th" : th,
						"td" : td,
						"index": index,
						"type": json.total
					})
				}
			}
		}.bind(this));

		var tds = this.datatable.templateTr.getElements("td");
		//datatable$Data Module
		tds.each(function(td, index){
			var json = this.form._getDomjson(td);
			if (json){
				//总计列
				var tColumn = this.totalColumns.find(function(a){ return  a.index === index });
				if(tColumn){
					var moduleNodes = this.form._getModuleNodes(td); //获取总计列内的填写组件
					if( moduleNodes.length > 0 ){
						tColumn.moduleJson = this.form._getDomjson(moduleNodes[0]);
						if(tColumn.type === "number")this.totalNumberModuleIds.push( tColumn.moduleJson.id );
					}
				}
			}
		}.bind(this));
	},
	_loadTotal: function(){
		var totalData = {};
		if( !this.datatable.totalFlag )return totalData;
		if (!this.totalTr)this._loadTotalTr();
		var data;
		if( this.datatable.isShowAllSection ){
			Object.each( this.datatable.getBusinessDataById(), function (d, k) {
				if( this.sectionKey === k )data = d
			}.bind(this))
		}else{
			data = this.data.data;
		}
		this.totalColumns.each(function(column, index){
			var json = column.moduleJson;
			if(!json)return;

			var pointLength = 0; //小数点后的最大数位
			var tmpV;
			if (column.type === "count"){
				tmpV = data.data.length;
			}else if(column.type === "number"){
				tmpV = new Decimal(0);
				for (var i=0; i<data.data.length; i++){
					var d = data.data[i];
					if(d[json.id]){
						tmpV = tmpV.plus(d[json.id].toFloat() || 0);
						var v = d[json.id].toString();
						if( v.indexOf(".") > -1 ){
							pointLength = Math.max(pointLength, v.split(".")[1].length);
						}
					}
				}
			}

			if( isNaN( tmpV ) ){
				totalData[json.id] = "";
				column.td.set("text", "" );
			}else{
				if( pointLength > 0 && tmpV.toString() !== "0" ){
					var s = tmpV.toString();
					if( s.indexOf(".") > -1 ){
						var length = s.split(".")[1].length;
						if( length < pointLength ){
							totalData[json.id] = s + "0".repeat(pointLength-length);
						}else{
							totalData[json.id] = s;
						}
					}else{
						totalData[json.id] = s +"."+ "0".repeat(pointLength)
					}
				}else{
					totalData[json.id] = tmpV.toString();
				}
				column.td.set("text", totalData[json.id] );
			}
		}.bind(this));
		data.total = totalData;
		return totalData;
	}
});

MWF.xApplication.process.Xform.DatatablePC.Line =  new Class({
	Implements: [Options, Events],
	options: {
		isNew: false,
		isEdited : true, //是否正在编辑
		isEditable : true, //能否被编辑
		isDeleteable: true, //能否被删除
		isAddable: true, //能否添加
		isMergeRead: false, //合并阅读
		index : 0,
		indexText : "0",
		indexInSectionLine: 0,
		indexInSectionLineText : "0",
		sectionKey: ""
	},
	initialize: function (node, datatable, data, options, sectionLine) {

		this.setOptions(options);

		this.node = node;
		this.datatable = datatable;
		this.data = data;
		this.form = this.datatable.form;
		this.sectionLine = sectionLine;

		// if( !this.datatable.multiEditMode && !this.options.isNew){
		// 	this.originalData = Object.clone(data);
		// }

		this.init()

	},
	init: function(){
		this.modules = [];
		this.all = {};
		this.all_templateId = {};

		this.fields = [];
		this.allField = {};
		this.allField_templateId = {};

		this.changedAttachmentMap = {};
	},
	load: function(){
		if( !this.datatable.multiEditMode && this.options.isEdited )this.datatable.currentEditedLine = this;

		this.loadModules();
		this.loadSequence();
		this.createActions();
		this.loadZebraStyle();
		this.loadEditedStyle();
		this.addNodeEvent();

		if( !this.datatable.multiEditMode )this.originalData = Object.clone(this.data);

		// if(this.options.isNew && this.options.isEdited){
		// 	debugger;
		// 	this.data = this.getData();
		// 	if( !this.datatable.multiEditMode )this.originalData = Object.clone(this.data);
		// 	this.options.isNew = false;
		// }
	},
	loadModules: function(){
		this.node.set("html", this.datatable.templateHtml);
		var moduleNodes = this.form._getModuleNodes(this.node, true);

		//合并状态或拆分状态
		var sectionKey = this.options.sectionKey || this.datatable.sectionBy;
		moduleNodes.each(function (node) {
			var mwfType = node.get("MWFtype");
			if (mwfType === "form")return;

			var _self = this;

			var tJson = this.form._getDomjson(node);
			if( tJson ){
				var json = Object.clone(tJson);

				if( !this.options.isEdited || !this.options.isEditable )json.isReadonly = true;

				var templateJsonId = json.id;

				var index = this.options.index;

				var id;
				if( this.datatable.isShowAllSection ){
					id = this.datatable.json.id + ".." + sectionKey + "..data.." + this.options.indexInSectionLine + ".." + json.id;
				}else if( sectionKey ){
					id = this.datatable.json.id + ".." + sectionKey + "..data.." + index + ".." + json.id;
				}else{
				    id = this.datatable.json.id + "..data.." + index + ".." + json.id;
				}

				json.id = id;
				node.set("id", id);

				if( json.type==="Attachment" || json.type==="AttachmentDg" ){
					json.type = "AttachmentDg";
					json.ignoreSite = true;
					json.site = this.getAttachmentSite(json, templateJsonId, sectionKey);
				}

				if (this.form.all[id]) this.form.all[id] = null;
				if (this.form.forms[id])this.form.forms[id] = null;

				var hasData = this.data.hasOwnProperty(templateJsonId);

				var module = this.form._loadModule(json, node, function () {
					if( _self.options.isMergeRead ){
						this.field = false; //不希望保存数据
						this._getBusinessData = function(){
							return _self.data[templateJsonId];
						};
						this._setBusinessData = function () {};
					}
					if( _self.widget )this.widget = _self.widget;
					this.parentLine = _self;
					this.parentDatatable = _self.datatable;

					//只读方法值在页面加载的时候或者new的时候计算一下
					if( this.json.compute === "show" ){
						var needComputeShow = false;
						if( _self.datatable.loading ) {
							needComputeShow = true;
						}else if( _self.options.isNew && !_self.reloading ){
							needComputeShow = true;
						}
						if( !needComputeShow ){
							this.json.compute = "create"; //
							if( this.options.moduleEvents && this.options.moduleEvents.length ){ //恢复compute
								var eventName = ( this.options.moduleEvents || [] ).contains("afterLoad") ? "afterLoad" : "load";
								var resetCompute = function () {
									this.json.compute = "show";
									this.removeEvent( eventName, resetCompute );
								}.bind(this)
								this.addEvent(eventName, resetCompute);
							}
						}
					}

				});
				if(!module.parentLine)module.parentLine = this;
				if(!module.parentDatatable)module.parentDatatable = this.datatable;

				if((json.type==="Attachment" || json.type==="AttachmentDg")){
					module.addEvent("change", function(){
						if( this.datatable.multiEditMode ){
							_self.form.saveFormData();
						}else{
							_self.attachmentChangeFlag = true;
						}
					}.bind(this))
				}

				this.form.modules.push(module);

				this.modules.push(module);
				this.all[id] = module;
				this.all_templateId[templateJsonId] = module;

				if (module.field) {
					// if(hasData){
					// 	module.setData(this.data[templateJsonId]);
					// }else if(this.options.isEdited){
					// 	this.data[templateJsonId] = module.getData();
					// }
					if(this.options.isEdited) {
						if (json.type !== "Attachment" && json.type !== "AttachmentDg"){
							if( module.json.compute === "save" && module.getInputData ){
								this.data[templateJsonId] = module.getInputData();
							}else{
								this.data[templateJsonId] = module.getData();
							}
						}
					}
					this.allField[id] = module;
					this.allField_templateId[templateJsonId] = module;
					this.fields.push( module );

					if( this.options.isEdited && this.datatable.multiEditMode ){
						module.addEvent("change", function(){
							this.datatable.fireEvent("change", [{lines: [this], type: "editmodule", module: module}]);
						}.bind(this))
					}
					//该字段是合集数值字段
					if(this.datatable.multiEditMode && this.datatable.totalNumberModuleIds.contains(templateJsonId)){
						//module
						module.addEvent("change", function(){
							this.datatable._loadTotal();
							if( this.sectionLine )this.sectionLine._loadTotal();
						}.bind(this))
					}
				}
			}
		}.bind(this));
	},
	getIndex: function(){
		return this.options.index;
	},
	getModule: function(templateJsonId){
		return this.all_templateId[templateJsonId];
	},
	get: function(templateJsonId){
		return this.all_templateId[templateJsonId];
	},
	getAttachmentSite: function(json, templateJsonId, sectionKey){
		//确保site最长为64，否则后台会报错

		var index = this.options.index;

		var baseSite;
		baseSite =  "." + index + "."  + (json.site || templateJsonId);

		var maxLength;
		var sectionId = "";
		if( sectionKey ){
			maxLength = Math.floor((63 - baseSite.length)/2 );

			sectionId = (sectionKey.length > maxLength) ? sectionKey.substr(sectionKey.length-maxLength, maxLength) : sectionKey;
			sectionId = "." + sectionId;
		}else{
			maxLength = 64 - baseSite.length;
		}

		var templateId = this.datatable.json.id;
		templateId = (templateId.length > maxLength) ? templateId.substr(templateId.length-maxLength, maxLength) : templateId;

		return templateId + sectionId + baseSite;
	},
	deleteAttachment: function(){
		var saveFlag = false;
		for( var key in this.allField){
			var module = this.allField[key];
			if( module.json.type==="Attachment" || module.json.type==="AttachmentDg" ){
				var array = module._getBusinessData();
				(array || []).each(function(d){
					saveFlag = true;
					this.form.workAction.deleteAttachment(d.id, this.form.businessData.work.id);

					for( var i=0; i<this.form.businessData.attachmentList.length; i++ ){
						var attData = this.form.businessData.attachmentList[i];
						if( attData.id === d.id ){
							this.form.businessData.attachmentList.erase(attData);
							break;
						}
					}

				}.bind(this))
			}
		}
		return saveFlag;
	},
	loadSequence: function(){
		var sequenceTd = this.node.getElements(".mwf_sequence");
		if(sequenceTd){
			if( this.datatable.isShowSectionKey() ) {
				if (this.datatable.json.sequenceBySection === "section") {
					sequenceTd.set("text", this.options.indexInSectionLineText);
				} else {
					sequenceTd.set("text", this.options.indexText)
				}
			}else if( this.datatable.isShowSectionBy() ){
				if( this.datatable.json.sequenceBy === "section" ){
					sequenceTd.set("text", this.options.indexInSectionLineText );
				}else {
					sequenceTd.set("text", this.options.indexText)
				}
			}else{
				sequenceTd.set("text", this.options.indexText)
			}
		}
	},
	loadZebraStyle: function(){
		if ((this.options.index%2)===0 && this.datatable.json.zebraColor){
			this.node.setStyle("background-color", this.datatable.json.zebraColor);
		}else if(this.datatable.json.backgroundColor){
			this.node.setStyle("background-color", this.datatable.json.backgroundColor);
		}
	},
	loadEditedStyle: function(){
		if (!this.datatable.multiEditMode && this.options.isEdited && this.datatable.json.editStyles){
			var tds = this.node.getElements("td");
			tds.setStyles(this.datatable.json.editStyles);
		}
	},
	addNodeEvent: function(){
		if(!this.datatable.multiEditMode && this.options.isEditable){
			this.editFun = function(){
				if( !this.options.isEdited ){
					this.datatable._changeEditedLine(this)
				}
			}.bind(this);
			this.node.addEvent("click", this.editFun)
		}
	},
	createActions: function () {
		//不允许编辑，直接返回
		if(!this.options.isEditable)return;

		var editActionTd = this.node.getElement(".mwf_editaction");
		var moveActionTd = this.node.getElement(".mwf_moveaction");

		if(this.datatable.multiEditMode){ //多行编辑模式
			if(this.options.isAddable)this.createAddAction(editActionTd);
			if(this.options.isDeleteable)this.createDelAction(editActionTd);
		}else{ //单行编辑模式
			if(this.options.isAddable)this.createAddAction(editActionTd);
			if(this.options.isDeleteable)this.createDelAction(editActionTd);
			this.createCompleteAction(editActionTd);
			this.createCancelEditAction(editActionTd);
			this.checkActionDisplay();
		}
		if( moveActionTd )this.createMoveAction(moveActionTd);

	},
	checkActionDisplay: function(){
		if( this.options.isEdited ){
			if( this.addLineAction )this.addLineAction.hide();
			if( this.delLineAction )this.delLineAction.hide();
			if( this.completeLineAction )this.completeLineAction.show();
			if( this.cancelLineEditAction )this.cancelLineEditAction.show();
		}else{
			if( this.addLineAction )this.addLineAction.show();
			if( this.delLineAction )this.delLineAction.show();
			if( this.completeLineAction )this.completeLineAction.hide();
			if( this.cancelLineEditAction )this.cancelLineEditAction.hide();
		}
	},
	createAddAction: function(td){
		this.addLineAction = new Element("div", {
			"styles": this.form.css.addLineAction,
			"events": {
				"click": function(ev){
					this.datatable._insertLine( ev, this );
					ev.stopPropagation();
				}.bind(this)
			}
		}).inject(td);
	},
	createCompleteAction: function(td){
		this.completeLineAction = new Element("div", {
			"styles": this.form.css.completeLineAction,
			"events": {
				"click": function(ev){
					this.datatable._completeLineEdit(ev, true);
					ev.stopPropagation();
				}.bind(this)
			}
		}).inject(td);
	},
	createCancelEditAction: function(td){
		this.cancelLineEditAction = new Element("div", {
			"styles": this.form.css.delLineAction,
			"events": {
				"click": function(ev){
					this.datatable._cancelLineEdit(ev, this);
					ev.stopPropagation();
				}.bind(this)
			}
		}).inject(td);
	},
	createDelAction: function(td){
		this.delLineAction = new Element("div", {
			"styles": this.form.css.delLineAction,
			"events": {
				"click": function(ev){
					this.datatable._deleteLine( ev, this );
					// if( this.datatable.currentEditedLine === this )this.datatable.currentEditedLine = null;
					ev.stopPropagation();
				}.bind(this)
			}
		}).inject(td);
	},
	createMoveAction: function(td){
		this.moveAction = new Element("div", {
			"styles": this.form.css.datatableMoveLineAction,
			"text": "↑",
			"events": {
				"click": function(ev){
					this.datatable._moveUpLine( ev, this );
					// if( this.datatable.currentEditedLine === this )this.datatable.currentEditedLine = null;
					ev.stopPropagation();
				}.bind(this)
			}
		}).inject(td);
	},
	changeEditMode: function( isEdited ){
		if( isEdited === this.options.isEdited )return;
		if( !this.options.isEditable )return;
		this.options.isEdited = isEdited;
		this.reload();
		if( this.options.isEdited ){
			this.datatable.fireEvent("editLine",[this]);
		}
	},
	reload: function(){
		this.reloading = true;
		for(var key in this.all){
			var module = this.all[key];
			this.form.modules.erase(module);
			if (this.form.all[key]) delete this.form.all[key];
			if (this.form.forms[key])delete this.form.forms[key];
		}
		this.node.empty();
		if(this.editFun){
			this.node.removeEvent("click", this.editFun);
			this.editFun = null;
		}
		this.init();
		this.load();
		this.reloading = false;
	},
	clearSubModules: function () { //把module清除掉
		for(var key in this.all){
			var module = this.all[key];
			//如果嵌套数据模板或者数据表格，还要清除掉下级
			if(module.clearSubModules)module.clearSubModules();
			this.form.modules.erase(module);
			if (this.form.all[key]) delete this.form.all[key];
			if (this.form.forms[key])delete this.form.forms[key];
		}
		this.node.destroy();
		this.init();
	},
	computeModuleData: function( when ){
		for( var key in this.allField_templateId){
			var module = this.allField_templateId[key];
			if( module.json.compute === when ){
				this.data[key] = module.getData();
			}
		}
	},
	getData: function () {
		var data = this.data;
		for( var key in this.allField_templateId){
			var module = this.allField_templateId[key];
			// var id = key.split("..").getLast();
			if( module.json.type==="Attachment" || module.json.type==="AttachmentDg" ){
				data[key] = module._getBusinessData();
			}else{
				data[key] = module.getData();
			}
		}
		return data;
	},
	setData: function (data) {
		this.datatable._setLineData(this, data);
	},
	validation: function(){
		if( !this.options.isEdited || !this.options.isEditable )return true;
		if( !this.validationFields())return false;
		if( !this.validationCompleteLine())return false;
		return true;
	},
	validationFields: function(){
		if( !this.options.isEdited || !this.options.isEditable )return true;
		var flag = true;
		this.fields.each(function(field, key){
			if (field.json.type!="sequence" && field.validationMode ){
				field.validationMode();
				if (!field.validation()) flag = false;
			}
		}.bind(this));
		return flag;
	},
	validationCompleteLine: function(){
		if( !this.options.isEdited || !this.options.isEditable )return true;
		var flag = true;
		if( !this.datatable.multiEditMode ){
			if (this.datatable.json.validationCompleteLine && this.datatable.json.validationCompleteLine.code){
				flag = this.form.Macro.exec(this.datatable.json.validationCompleteLine.code, this);
				if (!flag) flag = MWF.xApplication.process.Xform.LP.lineNotValidation;
			}
		}
		if (flag.toString()!=="true"){
			var isTr = !layout.mobile;
			this.notValidationMode(flag, isTr);
			return false;
		}
		return true;
	},
	createErrorNode: function(text, isTr){
		var node, tr, td;
		if( this.form.json.errorStyle ){
			if( this.form.json.errorStyle.type === "notice" ){
				if( !this.form.errorNoticing ){ //如果是弹出
					this.form.errorNoticing = true;
					this.form.notice(text, "error", this.node, null, null, {
						onClose : function () {
							this.form.errorNoticing = false;
						}.bind(this)
					});
				}
			}else{
				if( isTr ){
					tr = new Element("tr");
					td = new Element("td", {"colspan": this.datatable.columnCount}).inject(tr);
				}
				node = new Element("div",{
					"styles" : this.form.json.errorStyle.node,
					"text": text
				});
				if( td )node.inject(td);
				if( this.form.json.errorStyle.close ){
					var closeNode = new Element("div",{
						"styles" : this.form.json.errorStyle.close ,
						"events": {
							"click" : function(){
								// (tr || node).destroy();
								this.validationMode()
							}.bind(this)
						}
					}).inject(node);
				}
			}
		}else{
			if( isTr ){
				tr = new Element("tr");
				td = new Element("td", {"colspan": this.datatable.columnCount}).inject(tr);
			}
			node = new Element("div");
			if( td )node.inject(td);
			var iconNode = new Element("div", {
				"styles": {
					"width": "20px",
					"height": "20px",
					"float": "left",
					"background": "url("+"../x_component_process_Xform/$Form/default/icon/error.png) center center no-repeat"
				}
			}).inject(node);
			var textNode = new Element("div", {
				"styles": {
					"height": "20px",
					"line-height": "20px",
					"margin-left": "20px",
					"color": "red",
					"word-break": "keep-all"
				},
				"text": text
			}).inject(node);
		}
		return tr || node;
	},
	notValidationMode: function(text, isTr){
		if (!this.isNotValidationMode){
			this.isNotValidationMode = true;
			this.node.store("borderStyle", this.node.getStyles("border-left", "border-right", "border-top", "border-bottom"));
			this.node.setStyle("border-color", "red");

			this.errNode = this.createErrorNode(text, isTr);
			//if (this.iconNode){
			//    this.errNode.inject(this.iconNode, "after");
			//}else{
			this.errNode.inject(this.node, "after");
			//}
			this.showNotValidationMode(this.node);

			var parentNode = this.errNode;
			while( parentNode.offsetParent === null ){
				parentNode = parentNode.getParent();
			}

			if (!parentNode.isIntoView()) parentNode.scrollIntoView(false);
		}
	},
	showNotValidationMode: function(node){
		var p = node.getParent("div");
		if (p){
			var mwftype = p.get("MWFtype") || p.get("mwftype");
			if (mwftype == "tab$Content"){
				if (p.getParent("div").getStyle("display")=="none"){
					var contentAreaNode = p.getParent("div").getParent("div");
					var tabAreaNode = contentAreaNode.getPrevious("div");
					var idx = contentAreaNode.getChildren().indexOf(p.getParent("div"));
					var tabNode = tabAreaNode.getLast().getFirst().getChildren()[idx];
					tabNode.click();
					p = tabAreaNode.getParent("div");
				}
			}
			this.showNotValidationMode(p);
		}
	},
	validationMode: function(){
		if (this.isNotValidationMode){
			this.isNotValidationMode = false;
			this.node.setStyles(this.node.retrieve("borderStyle"));
			if (this.errNode){
				this.errNode.destroy();
				this.errNode = null;
			}
		}
	},

	resetDataWithOriginalData: function () {
		var data = this.originalData;
		var attachmentList = this.form.businessData.attachmentList;
		for( var key in this.allField_templateId){
			var module = this.allField_templateId[key];
			if( module.json.type==="Attachment" || module.json.type==="AttachmentDg" ){
				data[key] = (data[key] || []).filter(function(att, index){
					for( var i=0; i<attachmentList.length; i++){
						if( attachmentList[i].id === att.id )return true;
					}
					return false;
				}.bind(this))
			}
			this.data[key] = data[key];
		}
		return data;
	}
});

MWF.xApplication.process.Xform.DatatablePC.Exporter = new Class({
	Implements: [Options, Events],
	options: {
	},
	initialize: function (datatable, options) {

		this.setOptions(options);

		this.datatable = datatable;
		this.form = this.datatable.form;

		this.columnJsonList = [];
	},
	exportToExcel : function () {
		this.getColumnList();

		var resultArr = [];
		var titleArr = this.getTitleArray();
		resultArr.push( titleArr );


		this.datatable.lineList.each(function (line, index) {
			resultArr.push( this.getLineExportData(line, index) );
		}.bind(this));

		var colWidthArr = this.getColWidthArray();
		var excelName = this.getExcelName();

		var arg = {
			data : resultArr,
			colWidthArray : colWidthArr,
			title : excelName
		};
		this.datatable.fireEvent("export", [arg]);

		new MWF.xApplication.process.Xform.DatatablePC.ExcelUtils( this.datatable ).exportToExcel(
			arg.data || resultArr,
			arg.title || excelName,
			arg.colWidthArray || colWidthArr,
			this.getDateIndexArray()  //日期格式列下标
		);
	},
	getColumnList: function(){
		this.columnJsonList = [];

		var ths = this.datatable.titleTr.getElements("th.mwf_origional");
		var tds = this.datatable.templateTr.getElements("td.mwf_origional");

		ths.each(function(th, index){
			var thJson = this.form._getDomjson( th );

			var mJson;
			if(tds[index]){
				var mNodes = this.form._getModuleNodes(tds[index]); //获取总计列内的填写组件
				if( mNodes.length > 0 )mJson = this.form._getDomjson(mNodes[0]);
			}

			if(thJson && mJson && this.isAvaliableColumn(thJson, mJson)){
				this.columnJsonList.push({
					"thJson": thJson,
					"title": th.get("text"),
					"mJson" : mJson,
					"available": true
				})
			}
		}.bind(this));
	},
	getLineExportData: function(line, index ){
		var exportData = [];
		this.columnJsonList.each(function (column) {

			var module;
			if( column.mJson && column.available ){
				module = line.all_templateId[column.mJson.id];
			}
			if ( !module ) {
				exportData.push("");
			}else{
				var value = module.getData();
				var text = "";

				if( value ){
					switch (column.mJson.type) {
						case "Org":
						case "Reader":
						case "Author":
						case "Personfield":
						case "Orgfield":
							if (o2.typeOf(value) === "array") {
								var textArray = [];
								value.each(function (item) {
									if (o2.typeOf(item) === "object") {
										textArray.push(item.distinguishedName);
									} else {
										textArray.push(item);
									}
								}.bind(this));
								text = textArray.join(", \n");
							} else if (o2.typeOf(value) === "object") {
								text = value.distinguishedName;
							} else {
								text = value;
							}
							break;
						case "Combox":
						case "Address":
							text = o2.typeOf(value) === "array" ? value.join(", ") : value;
							break;
						case "Checkbox":
							var options = module.getOptionsObj();
							var value = o2.typeOf(value) === "array" ? value : [value];
							var arr = [];
							value.each( function( a, i ){
								var idx = options.valueList.indexOf( a );
								arr.push( idx > -1 ? options.textList[ idx ] : "") ;
							});
							text = arr.join(", ");
							break;
						case "Radio":
						case "Select":
							var options = module.getOptionsObj();
							var idx = options.textList.indexOf( value );
							text = idx > -1 ? options.valueList[ idx ] : "";
							break;
						case "Textarea":
							text = value;
							break;
						case "Calendar":
							text = value;
							break;
						default:
							text = value;
							break;
					}
				} else if ( column.mJson.type === "Label" && module.node) {
					text = module.node.get("text");
				}

				if( !text && o2.typeOf(text) !== "number" ){
					text = "";
				}

				exportData.push( text );
			}
		}.bind(this));
		return exportData;
	},
	isAvaliableColumn : function(thJson, mJson){
		if (thJson && ( thJson.isShow === false || thJson.isImpExp === false ))return false; //隐藏列，不允许导入导出
		if (mJson && (mJson.type == "sequence" || mJson.cellType == "sequence") )return false; //序号列
		if (mJson && ["Image","Button","ImageClipper","WritingBoard","Attachment","AttachmentDg","Label"].contains(mJson.type) )return false; //图片，附件,Label列不导入导出
		// if (type==="import" && module && ["Label"].contains(module.json.type))return false; //Label 不导入
		return true;
	},
	getColWidthArray : function(){
		var colWidthArr = [];
		this.columnJsonList.each(function(c, index){
			if ( c.available ) {
				if (c.mJson && ["Org","Reader","Author","Personfield","Orgfield"].contains(c.mJson.type)) {
					colWidthArr.push(340);
				} else if (c.mJson && c.mJson.type === "Address") {
					colWidthArr.push(170);
				} else if (c.mJson && c.mJson.type === "Textarea") {
					colWidthArr.push(260);
				} else if (c.mJson && c.mJson.type === "Htmleditor") {
					colWidthArr.push(500);
				} else if (c.mJson && c.mJson.type === "TinyMCEEditor") {
					colWidthArr.push(500);
				} else if (c.mJson && c.mJson.type === "Calendar") {
					colWidthArr.push(150);
				} else {
					colWidthArr.push(150);
				}
			}
		}.bind(this));
		return colWidthArr;
	},
	getDateIndexArray : function(){
		var dateIndexArr = []; //日期格式列下标
		var idx=0;
		this.columnJsonList.each(function(c){
			if ( c.available && c.mJson ) {
				if(c.mJson.type === "Calendar")dateIndexArr.push(idx);
				idx++;
			}
		}.bind(this));
		return dateIndexArr;
	},
	getTitleArray : function(){
		var arr = [];
		this.columnJsonList.each(function(c, index){
			if ( c.available && c.mJson )arr.push(c.title);
		}.bind(this));
		return arr;
	},
	getExcelName: function(){
		var title;
		if( this.datatable.json.excelName && this.datatable.json.excelName.code ){
			title = this.form.Macro.exec(this.datatable.json.excelName.code, this);
		}else{
			title = MWF.xApplication.process.Xform.LP.datatableExportDefaultName;
		}
		var titleA = title.split(".");
		if( ["xls","xlst"].contains( titleA[titleA.length-1].toLowerCase() ) ){
			titleA.splice( titleA.length-1 );
		}
		title = titleA.join(".");
		return title;
	},

	exportWithImportDataToExcel : function ( importedData ) {
		this.getColumnList();

		var resultArr = [];

		var titleArr = this.getTitleArray("import");
		titleArr.push( MWF.xApplication.process.Xform.LP.validationInfor );
		resultArr.push( titleArr );

		importedData.each( function( lineData, lineIndex ){
			var array = [];
			this.columnJsonList.each( function (obj, i) {
				array.push( ( lineData[ obj.title ] || '' ).replace(/&#10;/g, "\n") );
			});
			array.push( lineData.errorTextListExcel ? lineData.errorTextListExcel.join("\n") : ""  );

			resultArr.push( array );
		}.bind(this));

		var colWidthArr = this.getColWidthArray();
		colWidthArr.push( 300 ); //提示信息

		var excelName = this.getExcelName();

		var arg = {
		    data : resultArr,
		    colWidthArray : colWidthArr,
		    title : excelName,
		    withError : true
		};
		this.datatable.fireEvent("export", [arg]);

		new MWF.xApplication.process.Xform.DatatablePC.ExcelUtils( this.datatable ).exportToExcel(
		    arg.data || resultArr,
		    arg.title || excelName,
		    arg.colWidthArray || colWidthArr,
		    this.getDateIndexArray() //日期格式列下标
		 );
	}
});

MWF.xApplication.process.Xform.DatatablePC.Importer = new Class({
	Implements: [Options, Events],
	options: {
	},
	initialize: function (datatable, options) {

		this.setOptions(options);

		this.datatable = datatable;
		this.form = this.datatable.form;

		this.columnJsonList = [];
	},
	isAvaliableColumn : function(thJson, mJson){
		if (thJson && ( thJson.isShow === false || thJson.isImpExp === false ))return false; //隐藏列，不允许导入导出
		if (mJson && (mJson.type == "sequence" || mJson.cellType == "sequence") )return false; //序号列
		if (mJson && ["Image","Button","ImageClipper","WritingBoard","Attachment","AttachmentDg","Label"].contains(mJson.type) )return false; //图片，附件,Label列不导入导出
		// if (type==="import" && module && ["Label"].contains(module.json.type))return false; //Label 不导入
		return true;
	},
	importFromExcel : function () {
		this.getColumnList();
		var dateColArray = this.getDateIndexArray(); //日期列
		var orgTitleArray = this.getOrgTitleArray();

		new MWF.xApplication.process.Xform.DatatablePC.ExcelUtils( this.datatable ).upload( dateColArray, function (data) {
			if( !this.checkCount(data) )return;
			var checkAndImport = function () {
				if( !this.checkData( data ) ){
					this.openErrorDlg( data );
				}else{
					this.importData( data )
				}
				this.destroySimulateModule();
			}.bind(this);

			if( orgTitleArray.length > 0 ){
				this.listAllOrgData( orgTitleArray, data, function () {
					checkAndImport();
				}.bind(this));
			}else{
				checkAndImport();
			}


		}.bind(this));
	},
	destroySimulateModule: function(){
		if( !this.simelateModuleMap )return;
		var keys = Object.keys(this.simelateModuleMap);
		keys.each(function (key, i) {
			var module = this.simelateModuleMap[key];
			if( module ){
				var id = module.json.id;
				if( this.form.businessData.data.hasOwnProperty(id) )delete this.form.businessData.data[id];
				delete this.simelateModuleMap[key];
			}
		}.bind(this))
		this.simelateModuleMap = null;

		if(this.simulateNode){
			this.simulateNode.destroy();
			this.simulateNode = null;
		}
	},
	loadSimulateModule: function(){
		if( this.simelateModuleMap ){
			this.destroySimulateModule();
		}
		//加载模拟字段
		this.simelateModuleMap = {};
		this.simulateNode = new Element("div").inject(this.datatable.node);
		this.simulateNode.hide();
		this.simulateNode.set("html", this.datatable.templateHtml);
		var moduleNodes = this.form._getModuleNodes(this.simulateNode);
		moduleNodes.each(function (node) {
			if (node.get("MWFtype") !== "form") {
				var _self = this;

				var tJson = this.form._getDomjson(node);
				if( tJson && this.isAvaliableColumn(null, tJson) ){
					var json = Object.clone(tJson);

					var templateJsonId = json.id;

					json.id = "dtSimulate_"+json.id;
					node.set("id", json.id);

					if (!MWF["APP" + json.type]) {
						MWF.xDesktop.requireApp("process.Xform", json.type, null, false);
					}
					var module = new MWF["APP" + json.type](node, json, this.form);

					this.simelateModuleMap[templateJsonId] = module;

					module.load();

				}
			}
		}.bind(this));
	},
	getColumnList: function(){
		this.loadSimulateModule();

		this.columnJsonList = [];

		var ths = this.datatable.titleTr.getElements("th.mwf_origional");
		var tds = this.datatable.templateTr.getElements("td.mwf_origional");
		var idx = 0;

		ths.each(function(th, index){
			var thJson = this.form._getDomjson( th );

			var mJson;
			if(tds[index]){
				var mNodes = this.form._getModuleNodes(tds[index]); //获取总计列内的填写组件
				if( mNodes.length > 0 )mJson = this.form._getDomjson(mNodes[0]);
			}

			if(thJson && mJson && this.isAvaliableColumn(thJson, mJson)){
				this.columnJsonList.push({
					"thJson": thJson,
					"title": th.get("text"),
					"mJson" : mJson,
					"field": mJson.id,
					"index": idx,
					"module": this.simelateModuleMap[mJson.id]
				})
				idx++;
			}
		}.bind(this));

		return this.columnJsonList;
	},
	getDateIndexArray : function(){
		var dateIndexArr = []; //日期格式列下标
		var idx=0;
		this.columnJsonList.each(function(c){
			if ( c.mJson && c.mJson.type === "Calendar") {
				dateIndexArr.push(idx);
			}
			idx++;
		}.bind(this));
		return dateIndexArr;
	},
	getOrgTitleArray : function(){
		var orgTitleArr = [];
		this.columnJsonList.each(function(c){
			if ( c.mJson && ["Org","Reader","Author","Personfield","Orgfield"].contains(c.mJson.type) ) {
				orgTitleArr.push(c.title);
			}
		}.bind(this));
		return orgTitleArr;
	},
	parseImportedData: function(idata){
		var data = [];

		idata.each( function( ilineData ){
			var lineData = {};

			this.columnJsonList.each( function (obj, i) {
				var index = obj.index;
				var module = obj.module;
				var json = obj.mJson;
				var text = obj.title;

				var d = ilineData[text] || "";

				var value;
				if( d === "" || d === undefined || d === null ){
					value = "";
				}else{
					switch (json.type) {
						case "Org":
						case "Reader":
						case "Author":
						case "Personfield":
						case "Orgfield":
							var arr = this.stringToArray(d);
							if( arr.length === 0 ){
								value = this.getOrgData( d );
							}else{
								value = [];
								arr.each( function(d, idx){
									var obj = this.getOrgData( d );
									value.push( obj );
								}.bind(this));
							}
							break;
						case "Combox":
						case "Address":
							arr = this.stringToArray(d);
							value = arr.length === 0  ? arr[0] : arr;
							break;
						case "Checkbox":
							arr = this.stringToArray(d);
							var options = module.getOptionsObj();
							arr.each( function( a, i ){
								var idx = options.textList.indexOf( a );
								arr[ i ] = idx > -1 ? options.valueList[ idx ] : a;
							});
							value = arr.length === 1  ? arr[0] : arr;
							break;
						case "Radio":
						case "Select":
							value = d.replace(/&#10;/g,""); //换行符&#10;
							var options = module.getOptionsObj();
							var idx = options.textList.indexOf( value );
							value = idx > -1 ? options.valueList[ idx ] : value;
							break;
						case "Textarea":
							value = d.replace(/&#10;/g,"\n"); //换行符&#10;
							break;
						case "Calendar":
							value = d.replace(/&#10;/g,""); //换行符&#10;
							if( value && (new Date(value).isValid()) ){
								var format;
								if (!json.format){
									if (json.selectType==="datetime" || json.selectType==="time"){
										format = (json.selectType === "time") ? "%H:%M" : (Locale.get("Date").shortDate + " " + "%H:%M")
									}else{
										format = Locale.get("Date").shortDate;
									}
								}else{
									format = json.format;
								}
								value = Date.parse( value ).format( format );
							}
							break;
						default:
							value = d.replace(/&#10;/g,""); //换行符&#10;
							break;
					}
				}

				lineData[ json.id ] = value;

			}.bind(this));

			data.push( lineData );
		}.bind(this));

		return data;
	},
	stringToArray: function(string){
		return string.replace(/&#10;/g,",").split(/\s*,\s*/g ).filter(function(s){
			return !!s;
		});
	},
	importData: function(idata){

		var data = this.parseImportedData(idata);

		this.datatable.fireEvent("import", [data] );

		this.datatable.setData( { "data" : data } );

		this.datatable.fireEvent("afterImport", [data] );

		this.datatable.fireEvent("change", [{lines: this.datatable.lineList, type : "import"}]);

		this.form.notice( MWF.xApplication.process.Xform.LP.importSuccess );

	},
	openErrorDlg : function(eData){
		var _self = this;

		var objectToString = function (obj, type) {
			if(!obj)return "";
			var arr = [];
			Object.each(obj,  function (value, key) {
				if( type === "style" ){
					arr.push( key + ":"+ value +";" )
				}else{
					arr.push( key + "='"+ value +"'" )
				}
			})
			return arr.join(" ")
		}

		var htmlArray = ["<table "+ objectToString( this.datatable.json.impExpTableProperties ) +" style='"+objectToString( this.datatable.json.impExpTableStyles, "style" )+"'>"];

		var titleStyle = objectToString(this.datatable.json.impExpTableTitleStyles, "style");
		htmlArray.push("<tr>");
		this.columnJsonList.each(function (obj, i) {
			htmlArray.push( "<th style='"+titleStyle+"'>"+obj.title+"</th>" );
		});
		htmlArray.push("<th style='"+titleStyle+"'> "+MWF.xApplication.process.Xform.LP.validationInfor +"</th>");
		htmlArray.push("</tr>" );

		var contentStyles = Object.clone( this.datatable.json.impExpTableContentStyles );
		if( !contentStyles[ "border-bottom" ] && !contentStyles[ "border" ] )contentStyles[ "border-bottom" ] = "1px solid #eee";
		var contentStyle = objectToString( Object.merge( contentStyles, {"text-align":"left"}) , "style" );

		eData.each( function( lineData, lineIndex ){

			htmlArray.push( "<tr>" );
			this.columnJsonList.each( function (obj, i) {
				htmlArray.push( "<td style='"+contentStyle+"'>"+ ( lineData[ obj.title ] || '' ).replace(/&#10;/g,"<br/>") +"</td>" ); //换行符&#10;
			});
			htmlArray.push( "<td style='"+contentStyle+"'>"+( lineData.errorTextList ? lineData.errorTextList.join("<br/>") : "" )+"</td>" );
			htmlArray.push( "</tr>" );

		}.bind(this));
		htmlArray.push( "</table>" );

		var width = this.datatable.json.impExpDlgWidth || 1000;
		var height = this.datatable.json.impExpDlgHeight || 700;
		width = width.toInt();
		height = height.toInt();

		var div = new Element("div", { style : "padding:10px;", html : htmlArray.join("") });
		var dlg = o2.DL.open({
			"style" : this.form.json.dialogStyle || "user",
			"title": MWF.xApplication.process.Xform.LP.importFail,
			"content": div,
			"offset": {"y": 0},
			"isMax": true,
			"width": width,
			"height": height,
			"buttonList": [
				{
					"type": "exportWithError",
					"text": MWF.xApplication.process.Xform.LP.datagridExport,
					"action": function () { _self.exportWithImportDataToExcel(eData); }
				},
				{
					"type": "cancel",
					"text": MWF.LP.process.button.cancel,
					"action": function () { dlg.close(); }
				}
			],
			"onPostClose": function(){
				dlg = null;
			}.bind(this)
		});

	},
	checkCount: function(idata){
		var lp = MWF.xApplication.process.Xform.LP;

		var exceeded = false;
		var maxCount = this.datatable.json.maxCount ? this.datatable.json.maxCount.toInt() : 0;
		if( maxCount > 0 && idata.length > maxCount )exceeded = true;

		var less = false;
		var minCount = this.datatable.json.minCount ? this.datatable.json.minCount.toInt() : 0;
		if( minCount > 0 && idata.length < minCount) less = true;

		if( exceeded ) {
			var text = lp.importTooManyNotice.replace("{n1}", idata.length).replace("{n2}", this.datatable.json.maxCount);
			this.form.notice(text, "error");
			return false;
		}

		if( less ){
			var text = lp.importTooFewNotice.replace("{n1}", idata.length).replace("{n2}", this.datatable.json.minCount );
			this.form.notice(text,"error");
			return false;
		}
		return true;
	},
	checkData : function( idata ){
		var flag = true;

		var lp = MWF.xApplication.process.Xform.LP;
		var columnText =  lp.importValidationColumnText;
		var columnTextExcel = lp.importValidationColumnTextExcel;
		var excelUtil = new MWF.xApplication.process.Xform.DatatablePC.ExcelUtils( this.datatable );

		var parsedData = this.parseImportedData(idata, true);

		idata.each( function(lineData, lineIndex){

			var errorTextList = [];
			var errorTextListExcel = [];

			var parsedLineData = (parsedData && parsedData[lineIndex]) ? parsedData[lineIndex] : [];

			this.columnJsonList.each( function (obj, i) {
				var index = obj.index;
				var json = obj.mJson;
				var module = obj.module;
				var text = obj.title;

				var colInfor = columnText.replace( "{n}", index+1 );
				var colInforExcel = columnTextExcel.replace( "{n}", excelUtil.index2ColName( index ) );

				var d = lineData[text] || "";
				var parsedD = parsedLineData[json.id] || "";

				if(d){

					switch (json && json.type) {
						case "Org":
						case "Reader":
						case "Author":
						case "Personfield":
						case "Orgfield":
							var arr = this.stringToArray(d);
							arr.each( function(d, idx){
								var obj = this.getOrgData( d );
								if( obj.errorText ){
									errorTextList.push( colInfor + obj.errorText + lp.fullstop );
									errorTextListExcel.push( colInforExcel + obj.errorText + lp.fullstop );
								}
							}.bind(this));
							break;
						case "Number":
							if (isNaN(d)){
								errorTextList.push( colInfor + d + lp.notValidNumber + lp.fullstop );
								errorTextListExcel.push( colInforExcel + d + lp.notValidNumber + lp.fullstop );
							}
							break;
						case "Calendar":
							if( !( isNaN(d) && !isNaN(Date.parse(d) ))){
								errorTextList.push(colInfor + d + lp.notValidDate + lp.fullstop );
								errorTextListExcel.push( colInforExcel + d + lp.notValidDate + lp.fullstop );
							}
							break;
						default:
							break;
					}
				}
				if (module && module.setData && json.type !== "Address"){
					var hasError = false;
					if(["Org","Reader","Author","Personfield","Orgfield"].contains(json.type)){
						if(o2.typeOf(parsedD)==="array" && parsedD.length){
							hasError = parsedD.some(function (item) { return item.errorText; })
						}
					}
					if(!hasError){
						module.setData(parsedD); 
						module.validationMode();
						if (!module.validation() && module.errNode){
							errorTextList.push(colInfor + module.errNode.get("text"));
							errorTextListExcel.push( colInforExcel + module.errNode.get("text"));
							module.errNode.destroy();
						}
					}
				}
			}.bind(this));

			if(errorTextList.length>0){
				lineData.errorTextList = errorTextList;
				lineData.errorTextListExcel = errorTextListExcel;
				flag = false;
			}

		}.bind(this));

		var arg = {
			validted : flag,
			data : idata
		};
		this.datatable.fireEvent( "validImport", [arg] );

		return arg.validted;
	},
	exportWithImportDataToExcel: function(eData){
		var exporter = new MWF.xApplication.process.Xform.DatatablePC.Exporter(this.datatable);
		exporter.exportWithImportDataToExcel(eData)
	},
	getOrgData : function( str ){
		str = str.trim();
		var flag = str.substr(str.length-2, 2);
		switch (flag.toLowerCase()){
			case "@i":
				return this.identityMap[str] || {"errorText": str + MWF.xApplication.process.Xform.LP.notExistInSystem };
			case "@p":
				return this.personMap[str] || {"errorText":  str + MWF.xApplication.process.Xform.LP.notExistInSystem };
			case "@u":
				return this.unitMap[str] ||  {"errorText":  str + MWF.xApplication.process.Xform.LP.notExistInSystem };
			case "@g":
				return this.groupMap[str] ||  {"errorText":  str + MWF.xApplication.process.Xform.LP.notExistInSystem };
			default:
				return this.identityMap[str] ||
					this.personMap[str] ||
					this.unitMap[str] ||
					this.groupMap[str] ||
					{"errorText":  str + MWF.xApplication.process.Xform.LP.notExistInSystem };

		}
	},
	listAllOrgData : function (orgTitleList, iData, callback) {
		var identityList = [], personList = [], unitList = [], groupList = [];
		if( orgTitleList.length > 0 ){
			iData.each( function( lineData, lineIndex ){
				// if( lineIndex === 0 )return;

				orgTitleList.each( function (title, index) {

					if( !lineData[title] )return;

					var arr = this.stringToArray(lineData[title]);
					arr.each( function( a ){
						a = a.trim();
						var flag = a.substr(a.length-2, 2);
						switch (flag.toLowerCase()){
							case "@i":
								identityList.push( a ); break;
							case "@p":
								personList.push( a ); break;
							case "@u":
								unitList.push( a ); break;
							case "@g":
								groupList.push( a ); break;
							default:
								identityList.push( a );
								personList.push( a );
								unitList.push( a );
								groupList.push( a );
								break;
						}
					})
				}.bind(this))
			}.bind(this));
			var identityLoaded, personLoaded, unitLoaded, groupLoaded;
			var check = function () {
				if( identityLoaded && personLoaded && unitLoaded && groupLoaded ){
					if(callback)callback();
				}
			};

			this.identityMap = {};
			if( identityList.length ){
				identityList = identityList.unique();
				o2.Actions.load("x_organization_assemble_express").IdentityAction.listObject({ identityList : identityList }, function (json) {
					json.data.each( function (d) { this.identityMap[ d.matchKey ] = d; }.bind(this));
					identityLoaded = true;
					check();
				}.bind(this))
			}else{
				identityLoaded = true;
				check();
			}

			this.personMap = {};
			if( personList.length ){
				personList = personList.unique();
				o2.Actions.load("x_organization_assemble_express").PersonAction.listObject({ personList : personList }, function (json) {
					json.data.each( function (d) { this.personMap[ d.matchKey ] = d; }.bind(this));
					personLoaded = true;
					check();
				}.bind(this))
			}else{
				personLoaded = true;
				check();
			}

			this.unitMap = {};
			if( unitList.length ){
				unitList = unitList.unique();
				o2.Actions.load("x_organization_assemble_express").UnitAction.listObject({ unitList : unitList }, function (json) {
					json.data.each( function (d) { this.unitMap[ d.matchKey ] = d; }.bind(this));
					unitLoaded = true;
					check();
				}.bind(this))
			}else{
				unitLoaded = true;
				check();
			}

			this.groupMap = {};
			if( groupList.length ){
				groupList = groupList.unique();
				o2.Actions.load("x_organization_assemble_express").GroupAction.listObject({ groupList : groupList }, function (json) {
					json.data.each( function (d) { this.groupMap[ d.matchKey ] = d; }.bind(this));
					groupLoaded = true;
					check();
				}.bind(this))
			}else{
				groupLoaded = true;
				check();
			}
		}
	}
});

MWF.xDesktop.requireApp("Template", "utils.ExcelUtils", null, false);
MWF.xApplication.process.Xform.DatatablePC.ExcelUtils = new Class({
	Extends: MWF.xApplication.Template.utils.ExcelUtils
});
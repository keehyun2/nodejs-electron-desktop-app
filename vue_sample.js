Vue.component('v-select', VueSelect.VueSelect);
Vue.component('paginate', VuejsPaginate)

var yymmdd = $.datepicker.formatDate('yy-mm-dd', new Date());

// 전역 검색조건
var condition = {};

var app = new Vue({
	el : '#app',
	data : {// 초기 데이터 
		startDate : yymmdd,
		endDate : yymmdd,
		cancelStartDt : '',
		cancelEndDt : '',
		resStatus : 5,
		telecom : {label : '전체', value: ''},
		telecomOptions : [
			{label: '전체', value: ''},
			{label: 'SKT', value: 'SK'},
			{label: 'KT', value: 'KT'},
			{label: 'LGT', value: 'LG'}
		],
		/*grcode : {code : '전체'},
		grcodeOptions : [],*/
		totalList : [],
		totalListCnt : 0,
		mainList : [],
		mainListCnt : 0,
		summary: {
			hoCnt : 0,
			reqAmount : 0,
			failAmount : 0,
			failCnt : 0,
			cancelAmount : 0,
			cancelCnt : 0,
			succAmount : 0,
			succCnt : 0
		},
		selected : -1,
		showCnt : 16,
		selectedPage : 0
	},
	watch: {
		showCnt: function(obj) {
			if(obj < 10){
				this.showCnt = 10;
			}else if(obj > 100){
				this.showCnt = 100;
			}
			condition.endNum = this.selectedPage * this.showCnt;
			condition.startNum = condition.endNum - this.showCnt + 1;
			this.mainDetailSearch();
		},
		resStatus: function (obj) {
			this.search();
		},
		telecom: function (obj) {
			this.search();
		},
		totalList: function (obj) {
			this.summary = {
				hoCnt : 0,
				reqAmount : 0,
				failAmount : 0,
				failCnt : 0,
				cancelAmount : 0,
				cancelCnt : 0,
				succAmount : 0,
				succCnt : 0
			}
			_.forEach(app.totalList,function(obj, key){
//				console.log(obj);
				app.summary.hoCnt += obj.hoCnt;
				app.summary.reqAmount += obj.reqAmount;
				app.summary.failAmount += obj.failAmount;
				app.summary.failCnt += obj.failCnt;
				app.summary.cancelAmount += obj.cancelAmount;
				app.summary.cancelCnt += obj.cancelCnt;
				app.summary.succAmount += obj.succAmount;
				app.summary.succCnt += obj.succCnt;
			});
		}
		
	},
	created: function () {
		this.search();
	},
	mounted: function() {
		$('#startDate').datepicker().on('changeDate',function(e) { app.startDate = e.target.value; });
		$('#endDate').datepicker().on('changeDate',function(e) { app.endDate = e.target.value; });
		$('#cancelStartDt').datepicker().on('changeDate',function(e) { app.cancelStartDt = e.target.value; });
		$('#cancelEndDt').datepicker().on('changeDate',function(e) { app.cancelEndDt = e.target.value; });
	},
	/*computed: {
		reverse: function() {
			return this.posts.reverse();
		},
		orderedUsers: function () {
			return _.orderBy(this.posts, 'first_name')
		}
	},*/
	methods : {
		isEven : function(index){
			return index % 2 == 0
		},
		search : function(e){ 
			condition = {
				startDate : removeHyphen(this.startDate),
				endDate : removeHyphen(this.endDate),
				serviceType : 9,
				resStatus : this.resStatus,
				startCancelDate : removeHyphen(this.cancelStartDt),
				endCancelDate : removeHyphen(this.cancelEndDt),
				hpCd : this.telecom.value,
				avcMode : true
			}; 
			
			axios.post('app/approvSerarch.do',condition)
			.then(function(response) {
				app.totalList = response.data.totalList;
				app.totalListCnt = response.data.totalCnt;
				
			})
			.catch(function(e) {
				console.log(e);
			});
			
			this.mainList = [];
			this.mainListCnt = [];
			//this.mainDetailSearch();
		},
		today : function(e){
			app.startDate = yymmdd;
			app.endDate = yymmdd;
			$('#startDate').val(app.startDate).datepicker('update');
			$('#endDate').val(app.endDate).datepicker('update');
		},
		month : function(e){ 
			var oneDayAgo = new Date();
			oneDayAgo.setMonth(oneDayAgo.getMonth() -1  );
			app.startDate = $.datepicker.formatDate('yy-mm-dd', oneDayAgo);
			app.endDate = yymmdd;
			$('#startDate').val(app.startDate).datepicker('update');
			$('#endDate').val(app.endDate).datepicker('update');
		},
		today2 : function(e){
			app.cancelStartDt = $.datepicker.formatDate('yy-mm-dd', new Date());
			app.cancelEndDt = $.datepicker.formatDate('yy-mm-dd', new Date());
			$('#cancelStartDt').val(app.cancelStartDt).datepicker('update');
			$('#cancelEndDt').val(app.cancelEndDt).datepicker('update');
		},
		month2 : function(e){ 
			var oneDayAgo = new Date();
			oneDayAgo.setMonth(oneDayAgo.getMonth() -1  );
			app.cancelStartDt = $.datepicker.formatDate('yy-mm-dd', oneDayAgo);
			app.cancelEndDt = yymmdd;
			$('#cancelStartDt').val(app.cancelStartDt).datepicker('update');
			$('#cancelEndDt').val(app.cancelEndDt).datepicker('update');
		},
		detailSearch: function(index){
			this.selectedPage = 1;
			this.selected = index;
			
			condition.startDate = null;
			condition.endDate = null;
			condition.startNum = 1;
			condition.endNum = this.showCnt;
			
			this.mainDetailSearch();
		},
		clickCallback: function(page){
			this.selectedPage = page;
			condition.endNum = this.selectedPage * this.showCnt;
			condition.startNum = condition.endNum - this.showCnt + 1;
			this.mainDetailSearch();
		},
		mainDetailSearch: function(){
			condition.reqDate = this.totalList[this.selected].reqDate;
			
			axios.post('app/mainDetailSearch.do',condition)
			.then(function(response) {
				app.mainList = response.data.mainList;
				app.mainListCnt = response.data.totalCnt;
			})
			.catch(function(e) {
				console.log(e);
			});
		}
	}
})



var app = new Vue({
	el : '#app',
	data : {// 초기 데이터 
		keyword : "",
		status : ""
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
		}
	},
	created: function () {
	},
	mounted: function() {
	},
	methods : {
		search : function(e){ 
			condition = {
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
		}
	}
})

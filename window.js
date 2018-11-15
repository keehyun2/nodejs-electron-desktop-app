var app = new Vue({
	el : '#app',
	data : {// 초기 데이터 
		keyword : "진공포장기",
		excludeWord : "",
		recommendedPrice: "",
		recommendedText: "",
		productList : [],
		isTiles : false
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
				keyword : this.keyword
			}; 
			//console.log(app.keyword)
			//axios.get('http://54.180.31.161:9902/crawl',{params : condition })
			axios.get('http://localhost:9902/crawl',{params : condition })
			.then(function(response) {
				console.log(response.data);
				app.productList = response.data.productList;
				app.recommendedText = response.data.recommendedText
				app.recommendedPrice = response.data.recommendedPrice
			})
			.catch(function(e) {
				console.log(e);
				alert(e);
			});
		}
	}
})

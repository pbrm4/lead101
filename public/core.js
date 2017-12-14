var addstudents = angular.module('addStudents', []);

function mainController($scope, $http) {
    $scope.formData = {};
	$scope.regData = {};
	$scope.logData = {};
	$scope.students = {};
	$scope.log = {};
	$scope.formData1;

	
    // when landing on the page, get all todos and show them
		
		
		$http.get('/api/studentdata')
			.success(function(data) {
				$scope.students = data;
				console.log($scope.students[0]._id);
				console.log($scope.formData1.name);
			})
			.error(function(data) {
				console.log('Error: ' + data);
		});
		
		
		$scope.sendEdit = function(id){
			console.log(id);
			$scope.log.iid = id.toString();
			$http.post('/api/edit',$scope.log)
				.success(function(data){
					$scope.formData1 = data.valueOf();
					window.alert(data);
					window.location = '/add.html';

				})
				.error(function(data){
					console.log('Error: ' + data);
					
				});
		};
	
		$scope.checkUser = function(){
			$http.post('/api/loguser',$scope.logData)
				.success(function(data)
				{
					console.log(data.valueOf());
					var val = data.valueOf();
					var val2 = "\"success\"".valueOf();
					
					if(val == val2){
						console.log("YAY!");
						window.location = '/showstudent.html';
					}
					else{
						window.alert("Wrong password");
						$scope.logData = {};
					}
					
				})
				.error(function(data){
						console.log('Error: '+data);
				});
			
		};
		
		$scope.regData.hash = $scope.regData.pass;
		$scope.newUser = function(){
			$http.post('/api/adduser',$scope.regData)
				.success(function(data){
					console.log("got");
					window.location = '/testUI.html';
					
				})
				.error(function(data){
					console.log('Error: '+ data);
				});
		};
		
		
		
		
		$scope.formData.age = $scope.formData.date; 
		$scope.createTodo = function() {
			$http.post('/api/addstudents', $scope.formData)
				.success(function(data) {
					$scope.formData = {}; 
					$scope.todos = data;
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		};


		$scope.delete = function(id) {
			$http.delete('/api/del/' + id)
				.success(function(data) {
					$scope.students = data;
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		};
	
	
	
	
	
	
	$scope.hrstyle = {'border-color':'pink'};
	$scope.custom = {'width':'300px'};
	$scope.school = ["Lead School Karmala","Lead School 2","Lead School 3"];
	$scope.clas = ["1","2","3","4","5"];
	$scope.division = ["A","B","C","D"];

}
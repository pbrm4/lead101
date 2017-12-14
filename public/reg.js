var addstudents = angular.module('addStudents', []);

function mainController($scope, $http) {
    
	$scope.regData = {};

   

		$scope.newUser = function(){
			$http.post('/api/adduser',$scope.regData)
				.success(function(data){
					console.log("got");
					window.location = '/testUI.html';
					
				})
				.error(function(){
					console.log('Error: '+ data);
				});
		};
	
	

}
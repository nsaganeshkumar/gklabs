app.controller("settings", function($rootScope, $scope, $navigate) {

	$scope.mode = localStorage['p1maths.numberBond.mode']? localStorage['p1maths.numberBond.mode']: 'basic';
	$scope.maxNumber = localStorage['p1maths.numberBond.maxNumber']? localStorage['p1maths.numberBond.maxNumber']: 20;
	$scope.depth = localStorage['p1maths.numberBond.depth']? localStorage['p1maths.numberBond.depth']: "1";
	$scope.pyramidDepth = localStorage['p1maths.numberBond.pyramid.depth']? localStorage['p1maths.numberBond.pyramid.depth']: "2";
	$scope.nParts = localStorage['p1maths.numberBond.nParts']? localStorage['p1maths.numberBond.nParts']: "2";

	$scope.resetScore = false;
	
	$scope.basicMode = $scope.mode == 'basic'? true: undefined ;
	$scope.complexMode = $scope.mode == 'complex'? true: undefined ;
	$scope.pyramidMode = $scope.mode == 'pyramid'? true: undefined ;
	
	$scope.updateSettings = function() {
		if ($scope.validate()) {
			if ($scope.basicMode) {
				localStorage['p1maths.numberBond.mode'] = 'basic';
			} else if ($scope.pyramidMode) {
				localStorage['p1maths.numberBond.mode'] = 'pyramid';
			} else {
				localStorage['p1maths.numberBond.mode'] = 'complex';
			}
			
			localStorage['p1maths.numberBond.maxNumber'] = parseInt($scope.maxNumber);
			localStorage['p1maths.numberBond.depth'] = parseInt($scope.depth);
			localStorage['p1maths.numberBond.nParts'] = parseInt($scope.nParts);
			localStorage['p1maths.numberBond.pyramid.depth'] = parseInt($scope.pyramidDepth);
			
			var mesg = 'Settings updated successfully';
			if ($scope.resetScore) {
				localStorage['p1maths.numberBond.totalSums'] = 0;
				localStorage['p1maths.numberBond.score'] = 0;
				
				mesg += ' and score has been reset.';
			}
			
//			showMessage('Settings', 'Settings updated successfully', BootstrapDialog.TYPE_SUCCESS);
			BootstrapDialog.show({
		        title: 'Settings',
		        message: mesg,
		        type: BootstrapDialog.TYPE_SUCCESS,
		        buttons: [{
		            label: 'Ok',
		            action: function(dialogItself){
		            	dialogItself.close();
		            }
		        }
		       ],
		       onhidden: function(dialogRef){
	                $('.backButton').click();
	            }
			});						
		}
	};	
	
	$scope.validate = function() {
		if (!$scope.basicMode && !$scope.pyramidMode && !$scope.complexMode) {
			showMessage('Error', 'Please select a mode.');
			return false;
		}
		
		if (isNaN($scope.maxNumber) || isNaN($scope.depth) || isNaN($scope.nParts)) {
			showMessage('Error', 'All the inputs must be in numbers only.');
			return false;
		}
		
		if ($scope.maxNumber < 10 || $scope.maxNumber > 1000) {
			showMessage('Error', 'Maximum Number must be between 10 to 1000.');
			return false;
		}
		if (parseInt($scope.depth) < 1 || parseInt($scope.depth) > 4) {
			showMessage('Error', 'Levels must be between 1 to 4.');
			return false;
		}
		if (parseInt($scope.nParts) < 2 || parseInt($scope.nParts) > 3) {
			showMessage('Error', 'No. of parts can only be 2 or 3.');
			return false;
		}
		return true;
	};	
	
	$scope.changeMode = function(selectedMode) {
		console.log('select mode: ' + selectedMode);
		if (selectedMode == 'basic') {
			$scope.basicMode = true;
			$scope.complexMode = false;
			$scope.pyramidMode = false;
		} else if (selectedMode == 'pyramid') {
			$scope.basicMode = false;
			$scope.complexMode = false;
			$scope.pyramidMode = true;
		} else {
			$scope.basicMode = false;
			$scope.complexMode = true;
			$scope.pyramidMode = false;
		}		
	};
	
	
});
app.controller("numberBondGenerator", function($rootScope, $scope, $navigate, $compile) {

	$scope.partVal = -1;

	$scope.score = localStorage['p1maths.numberBond.score']? localStorage['p1maths.numberBond.score']: 0;
	$scope.numberOfSumsAttempted = localStorage['p1maths.numberBond.totalSums']? localStorage['p1maths.numberBond.totalSums']: 0; 
    
	$scope.numberBondProblem = {};

	$scope.mode = localStorage['p1maths.numberBond.mode']? localStorage['p1maths.numberBond.mode']: 'basic';
	$scope.complexModelMinValue = 50;
	$scope.complexModelMaxValue = 200;
	
	$scope.maxNumber = localStorage['p1maths.numberBond.maxNumber']? localStorage['p1maths.numberBond.maxNumber']: 20;
	$scope.depth = localStorage['p1maths.numberBond.depth']? localStorage['p1maths.numberBond.depth']: 1;
	$scope.pyramidDepth = localStorage['p1maths.numberBond.pyramid.depth']? localStorage['p1maths.numberBond.pyramid.depth']: 1;
	$scope.nParts = localStorage['p1maths.numberBond.nParts']? localStorage['p1maths.numberBond.nParts']: 2;	
   
	$scope.selectedPart;
	
	$scope.generateNew = function() {
		$scope.numberOfSumsAttempted++;
		localStorage['p1maths.numberBond.totalSums'] = $scope.numberOfSumsAttempted;
		
		if ($scope.mode == 'basic') {
			$scope.generateBasicBond();			
		} else if ($scope.mode == 'pyramid') {
			$scope.generatePyramid();		
		} else {
			$scope.generateComplexBond();
		}
	};
	
    $scope.generateBasicBond = function(){
    	$scope.numberBondProblem = new NumberBond($scope.maxNumber, $scope.depth, $scope.nParts).generate();    	
    	console.log(JSON.stringify($scope.numberBondProblem));
    	    	
    	new numberBondUI().draw($scope, $scope.numberBondProblem);
    };    

    $scope.generatePyramid = function() {
    	$scope.numberBondProblem = new NumberBondPyramid($scope.pyramidDepth).generate();    	
    	console.log(JSON.stringify($scope.numberBondProblem));
    	    	
    	new numberBondUI().draw($scope, $scope.numberBondProblem);
    };
    
    $scope.generateComplexBond = function(){
    	var rand = Math.floor((Math.random() * $scope.complexModelMaxValue));
    	if (rand < $scope.complexModelMinValue) {
    		rand += $scope.complexModelMinValue;
    	}
    	
//    	$scope.numberBondProblem = JSON.parse('{"value":"","showValue":false,"parts":[{"value":176,"showValue":true,"parts":[{"value":"","showValue":false},{"value":133,"showValue":true}]},{"value":"","showValue":false,"parts":[{"value":5,"showValue":true},{"value":19,"showValue":true}]}]}');
	    $scope.numberBondProblem = new complexNumberBond(rand).generate();		
	    console.log(JSON.stringify($scope.numberBondProblem));
	    
		new complexNumberBondUI().draw($scope, $scope.numberBondProblem);
    };
    
    $scope.submitAnswer = function() {
    	var result = validateAnswer($scope.numberBondProblem);
    	if (result) {
    		var isCorrect = checkIfAnswerIsCorrect($scope.numberBondProblem);
    		if (!isCorrect) {
    			var failureMesg = "<div style='width: 100%; text-align: center;'><img src='images/smiley-sad.jpg' width='200px;'/><br/><span class='sorryMessage'>Try again...You can do it!</span></div>"
    				
				BootstrapDialog.show({
    	            title: 'Sorry!',
    	            message: failureMesg, //"That's Brilliant...",
    	            type: BootstrapDialog.TYPE_DANGER,
    	            size: BootstrapDialog.SIZE_SMALL,
    	            buttons: [{
    	                label: 'Ok',
    	                action: function(dialogItself){
    	                	dialogItself.close();
    	                }
    	            }]
    	        });
    		} else {
    			$scope.score++;
            	localStorage['p1maths.numberBond.score'] = $scope.score;
            	                	
            	var successMesg = "<div style='width: 100%; text-align: center;'><img src='images/smiley-encourage.jpg' width='200px;'/></div>"
            	BootstrapDialog.show({
    	            title: 'Well done!',
    	            message: successMesg, //"That's Brilliant...",
    	            type: BootstrapDialog.TYPE_SUCCESS,
    	            size: BootstrapDialog.SIZE_SMALL,
    	            buttons: [{
    	                label: 'Close',
    	                action: function(dialogItself){
    	                	dialogItself.setMessage("Loading new problem...");
    	                	setTimeout(function() {		        	                		
        	                    dialogItself.close();
    	                	}, 1000);
    	                }
    	            }],
    	            
    	            onhidden: function(dialogItself) {
    	            	$scope.generateNew();
    	            }
    	        });
    		}
    	}
    };
    
    $scope.showEnterPartDialog = function (selectedPart) {
    	var template = '<input id="partVal" type="tel" numeric-field ng-model="partVal" maxlength="4" class="bootbox-input bootbox-input-text form-control">';
    	var fn = $compile(template);
    	var html = fn($scope);
    	
    	BootstrapDialog.show({
            title: 'Enter number',
            message: html,
            type: BootstrapDialog.TYPE_PRIMARY,
            buttons: [{
                label: 'Ok',
                action: function(dialogItself){	        	                	
                	var value = $scope.partVal? $scope.partVal.trim(): '';
                    if (value && value.length <= 4) {
                    	if (!isNaN(parseInt(value))) {
                    		selectedPart.partObj.value = parseInt(value);
                    		selectedPart.drawText();
                    	}
          			  	$scope.partVal = null;
          			  	dialogItself.close();
                    } else {
                    	if (isNaN(value)) {
                    		showMessage('Error', 'Only numbers allowed.');
                    	} else if (value.length > 4) {
                    		showMessage('Error', 'Maximum 4 digits only allowed.');
                    	}                                    	
                    }                                    
                }
            },
            {
                label: 'Cancel',
                action: function(dialogItself){	        	                	
          			  dialogItself.close();
                }
            },
            ],
            onshown: function(dialogItself) {
            	$('#partVal').focus();
            }
        });	  
    };
    
    function checkIfAnswerIsCorrect(numberBond) {
    	if (numberBond.parts) {
    		var sumOfParts = 0;
    		for (var i=0; i < numberBond.parts.length; i++) {
    			sumOfParts += parseInt(numberBond.parts[i].value);
    		}
    		
    		if (sumOfParts != numberBond.value) {
    			return false;
    		}
    		
    		for (var i=0; i < numberBond.parts.length; i++) {
    			if (numberBond.parts[i].parts) {
    				return checkIfAnswerIsCorrect(numberBond.parts[i]);
    			}
    		}
    	}
    	
    	return true;
    }
    
    function validateAnswer(numberBond) {
    	if (numberBond.value.length == 0) {
    		showMessage('Error', 'Please fill-up all missing parts')
    		return false;
    	}
    	
    	if (numberBond.parts) {
        	for (var i=0; i < numberBond.parts.length; i++) {
        		var result = validateAnswer(numberBond.parts[i]);
        		if (!result) {
        			return false;
        		}
        	}
    	}
    	
    	return true;
    }

});
app = angular.module('numberBond', ['ajoslin.mobile-navigate', 'ui', 'truncate', 'ngRoute', 'ngSanitize']);
app.config(function($routeProvider, $locationProvider) {
	
    $routeProvider.when("/home", {
        controller: 'numberBondGenerator',
        templateUrl: "partials/numberBond.html",
        title: 'Number Bonding'
    }).when("/settings", {
        controller: 'settings',
        templateUrl: "partials/settings.html",
        title: 'Settings'
    }).otherwise({
    		redirectTo: '/home'
    	}
	);
    
});

app.run(function($rootScope, $route, $http, $templateCache, $navigate, $window, $compile) {
	
    angular.forEach($route.routes, function(r) {
        if (r.templateUrl) {
            $http.get(r.templateUrl, {cache: $templateCache});
        }
    });

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.title = current.title;
        if (current.controller == 'numberBondGenerator') {
        	$rootScope.isHomePage = true;
        	        	
        	new numberBondUI().reset();
        } else {
        	$rootScope.isHomePage = false;
        }
    });
});

app.controller("header", function($rootScope, $scope, $navigate) {
	 $scope.$navigate = $navigate;	 
	 
});


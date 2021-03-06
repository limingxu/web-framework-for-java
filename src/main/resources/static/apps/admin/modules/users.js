app.controller('UsersCtrl',
    [ '$scope', 'appDialog', '$http',
    function($scope, appDialog, $http) {
        $scope.data = [];
        $scope.roles = null;

        $scope.init = function() {
            $http.get('/api/v1/app/users').then(function(res) {
                $scope.data = res.data;
            });
            $http.get('/api/v1/app/config/roles').then(function(res) {
                $scope.roles = res.data;
            });
        };

        $scope.editRoles = function(item) {
            $scope.userModel = angular.copy(item);
            if ($scope.userModel.roles && $scope.userModel.roles.length > 0) {
                for (var idx in $scope.roles) {
                    if ($scope.roles[idx].name == $scope.userModel.roles[0].name) {
                        $scope.userModel.currentRole = $scope.roles[idx];
                    }
                }
            }
            $('#rolesForm').modal('show');
        };
        $scope.changeRole = function(role) {
            $scope.userModel.currentRole = role;
        };
        $scope.saveRoles = function() {
            if ($scope.userModel.id) {
                var roleId = $scope.userModel.currentRole.id;
                $http.put('/api/v1/app/users/' + $scope.userModel.id + '/changerole?roleId=' + $scope.userModel.currentRole.id)
                    .then(function(res) {
                        $scope.init();
                        $('#rolesForm').modal('hide');
                    });
            }
        };

        $scope.remove = function(item) {
            appDialog.confirmDeletion(function(){
                $http.delete('/api/v1/app/users/' + item.id).then(function(res) {
                    $scope.data.splice($scope.data.indexOf(item), 1)
                    appDialog.success();
                });
            });
        };

        $scope.toggleEnabled = function(item) {
            $http.put('/api/v1/app/users/' + item.id + '/toggleenabled').then(function(res) {
                item.enabled = !item.enabled;
                appDialog.success();
            });
        };


        $scope.init();
    }]);

(function (angular) {
    'use strict';
    var app = angular.module("app", ["kendo.directives"]);

    app.controller("UserController", ['$scope', function ($scope) {
        $scope.users = {
            dataSource: [
             {
                 id: 1,
                 lastname: "Ромашева",
                 firstname: "Александра",
                 patronymic: "Игнатьевна",
                 birth: new Date(1989, 2, 24),
                 gender: "жен"
             }, {
                 id: 2,
                 lastname: "Филимонов",
                 firstname: "Евгений",
                 patronymic: "Владимирович",
                 birth: new Date(1990, 6, 7),
                 gender: "муж"
             }, {
                 id: 3,
                 lastname: "Локтева",
                 firstname: "Евгения",
                 patronymic: "Михайловна",
                 birth: new Date(1989, 10, 30),
                 gender: "жен"
             }, {
                 id: 4,
                 lastname: "Коваль",
                 firstname: "Екатерина",
                 patronymic: "Константиновна",
                 birth: new Date(1992, 1, 9),
                 gender: "жен"
             }, {
                 id: 5,
                 lastname: "Панков",
                 firstname: "Роман",
                 patronymic: "Олегович",
                 birth: new Date(1991, 2, 2),
                 gender: "муж"
             }, {
                 id: 6,
                 lastname: "Мамин-Сибиряк",
                 firstname: "Дмитрий",
                 patronymic: "Наркисович",
                 birth: new Date(1972, 11, 6),
                 gender: "муж"
             }, {
                 id: 7,
                 lastname: "Лоськов",
                 firstname: "Михаил",
                 patronymic: "Андреевич",
                 birth: new Date(1992, 08, 7),
                 gender: "муж"
             }, {
                 id: 8,
                 lastname: "Комарова",
                 firstname: "Надежда",
                 patronymic: "Владимировна",
                 birth: new Date(1988, 5, 5),
                 gender: "жен"
             }
            ],
            schema: {
                parse: function (response) {
                    $.each(response, function (idx, elem) {
                        if (elem.birth && typeof elem.birth === "string") {
                            elem.birth = kendo.parseDate(elem.birth, 'yyyy-MM-dd');
                        }
                    });
                    return response;
                }
            }
        };
        $scope.pageable = {
            pageSizes: true,
            previousNext: true,
            info: true
        };
        $scope.selectable = "true";
        $scope.editable = "inline";
        $scope.gridColumns = [
        {
            field: "lastname",
            title: "Фамилия",
            width: "25%"
        },
        {
            field: "firstname",
            title: "Имя",
            width: "15%"
        },
        {
            field: "patronymic",
            title: "Отчество",
            width: "20%"
        },
        {
            field: "birth",
            title: "Дата рождения",
            locale: "ru",
            format: '{0:dd MMMM yyyy}',
            width: "20%"
        },

        {
            field: "gender",
            title: "Пол",
            width: "10%"

        },
        {
            command: [{
                click: deleteUsr,
                text: "Remove",
                width: "10%"

            }]

        }]
       
        $scope.onSelect = function (data) {
            $scope.selected = JSON.parse(JSON.stringify(data));
            $scope.selected.birth = new Date(data.birth);
            $('#inputForm input[name=id]').val(data.id);
            $('#inputForm input[name=lastname]').val(data.lastname);
            $('#inputForm input[name=firstname]').val(data.firstname);
            $('#inputForm input[name=patronymic]').val(data.patronymic);
            $('#inputForm input[name=birth]').val(makeDate(data.birth));
            $('#inputForm select[name=gender]').val(data.gender);

        };

        $scope.updateUsr = function getObject() {
            var identity = $('#inputForm input[name=id]').val();
            var fn = $('#inputForm input[name=firstname]').val();
            var ln = $('#inputForm input[name=lastname]').val();
            var p = $('#inputForm input[name=patronymic]').val();
            var bd = new Date($('#inputForm input[name=birth]').val());
            var g = $('#inputForm select[name=gender]').val();
            var obj = new Object({
                id: identity,
                firstname: fn,
                lastname: ln,
                patronymic: p,
                birth: bd,
                gender: g
            });
            var allUsers = $scope.users.dataSource;
            for (var i = 0; i < allUsers.length; i++) {
                if (allUsers[i].id == obj.id) {
                    allUsers[i] = obj;
                    break;
                }
            }
            $('#grid').data('kendoGrid').dataSource.read();
            $('#grid').data('kendoGrid').refresh();
        }

       
        $scope.addUsr = function addObject() {
            var fn = $('#inputForm input[name=firstname]').val();
            var ln = $('#inputForm input[name=lastname]').val();
            var p = $('#inputForm input[name=patronymic]').val();
            var bd = new Date($('#inputForm input[name=birth]').val());
            var g = $('#inputForm select[name=gender]').val();
            var identity = -1;
            //если массив пустой
            if ($scope.users.dataSource.length < 1) {
                identity = 0;
            } else {
                identity = getLastId($scope.users.dataSource);
            }
            var obj = new Object({
                id: identity,
                firstname: fn,
                lastname: ln,
                patronymic: p,
                birth: bd,
                gender: g
            });
            $scope.users.dataSource.push(obj);

            $('#grid').data('kendoGrid').dataSource.read();
            $('#grid').data('kendoGrid').refresh();
        }

        $scope.clearUsr = function clearObject() {
            $scope.selected = {
                id: "",
                lastname: "",
                firstname: "",
                patronymic: "",
                birth: "",
                gender: "муж"
            };
            $('#inputForm input[name=id]').val('');
            $('#inputForm input[name=lastname]').val('');
            $('#inputForm input[name=firstname]').val('');
            $('#inputForm input[name=patronymic]').val('');
            $('#inputForm input[name=birth]').val('');
            $('#inputForm select[name=gender]').val("муж");

        }

        function deleteUsr(e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            for (var i = 0; i < $scope.users.dataSource.length; i++) {
                if ($scope.users.dataSource[i].id == dataItem.id) {
                    $scope.users.dataSource.splice(i, 1);
                    break;
                }
            }
            $('#grid').data('kendoGrid').dataSource.read();
            $('#grid').data('kendoGrid').refresh();
        }

        function makeDate(d) {
            var date = new Date(d);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if (month.toString().length < 2) {
                month = '0' + month;
            }
            if (day.toString().length < 2) {
                day = '0' + day;
            }

            var res = year + '-' + month + '-' + day;
            return res;
        }
        //возвращает id последнего элемента в отсортированном списке
        function getLastId(list) {
            var objList = JSON.parse(JSON.stringify(list));
            objList.sort(function (a, b) {
                if (a.id < b.id) {
                    return 1;
                }
                if (a.id > b.id) {
                    return -1;
                }
                if (a.id == b.id) {
                    return 0;
                }
            });
            var identity = objList[0].id + 1;
            return identity;
        }

    }]);
    app.directive('gridForm', function () {
        return {
            transclude: true,
            templateUrl: 'gridForm.html'
        }
    })
    app.directive('addForm', function () {
        return {
            transclude: true,
            templateUrl: 'addForm.html'
        }
    })
})(window.angular);



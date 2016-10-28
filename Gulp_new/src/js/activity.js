
// данные
    function makeRandomData(firstData) {
        var currentIndex, temporaryValue, randomIndex ;
        currentIndex = firstData.images.length - 1;
          while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = firstData.images[currentIndex];
            firstData.images[currentIndex] = firstData.images[randomIndex];
            firstData.images[randomIndex] = temporaryValue;
          };
        return firstData;
    };

	function takeNewData(newTheme) {

		  // IE8 & 9 only Cross domain JSON GET request
	    if ('XDomainRequest' in window && window.XDomainRequest !== null) {

	        var xdr = new XDomainRequest(); // Use Microsoft XDR
            var objMas;
	        xdr.open('get', 'http://api.pixplorer.co.uk/image?word=' + newTheme + '&amount=7&size=tb');
	        xdr.onload = function () {

                var JSON = JSON || {};
                // implement JSON.parse de-serialization
                    JSON.parse = JSON.parse || function (str) {
                    if (str === "") str = '""';
                    eval("var p=" + str + ";");
                    return p;
                };

	            var dom  = new ActiveXObject('Microsoft.XMLDOM'),
                    JSON = JSON.parse(xdr.responseText);
	            dom.async = false;

	            if (JSON == null || typeof (JSON) == 'undefined') {
                    JSON = JSON.parse(data.firstChild.textContent);
	            };

				if (JSON.status != "failed") {
                    jsonData = JSON; 
	                renderList(JSON);                    
                    doMasonry();
                    ie8shadowAdd('.grid');
	            };
	        };

	        xdr.onerror = function() {
	            _result = false;
	        };

	        xdr.send();            
	    }

	    // IE7 and lower can't do cross domain
	    else if (navigator.userAgent.indexOf('MSIE') != -1 &&
	             parseInt(navigator.userAgent.match(/MSIE ([\d.]+)/)[1], 10) < 8) {
	       		return false;
	    	}
	    	else        // Do normal XMLHttpRequest for everything else
			{
                var xhr = new XMLHttpRequest();
                var data,
                    objMas;
                xhr.open('GET', 'http://api.pixplorer.co.uk/image?word=' + newTheme + '&amount=7&size=tb', true);
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                xhr.send();

                xhr.onreadystatechange = function() {
                    if (this.readyState != 4) return;
                  // по окончании запроса доступны:
                  // status, statusText
                  // responseText, responseXML (при content-type: text/xml)

                    if (this.status != 200) {
                        alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
                        return;
                    } else {
                    // получить результат из this.responseText или this.responseXML
                        try {
                            data = JSON.parse(xhr.responseText);
                            jsonData = data;                            
                            renderList(data);                            
                            doMasonry();
                        } catch (e) {
                            alert( "Некорректный ответ " + e.message );
                        };
                    };
                };                
			};
	};

// виджет

    function ie8shadowAdd(place) {
        var operBlock = ( place == "body" ? document.getElementsByTagName(place)[0] : document.querySelectorAll(place)[0]);
        var placeInput = operBlock.querySelectorAll('.ie8shadow');
        var addDIV = document.createElement('div');
        addDIV.innerText = '';
        addDIV.style.display = "block";
        addDIV.style.width = "100%";
        addDIV.style.height = "100%";
        addDIV.style.background = "#000";
        addDIV.style.position = "absolute";
        addDIV.style.left = "0";
        addDIV.style.top = "0";
        addDIV.style.filter = "alpha(Opacity=25)";
        addDIV.style.zIndex = "1";

        for (var i = 0; i < placeInput.length; i++) {
            placeInput[i].appendChild(addDIV);
            placeInput[i].innerHTML += '<div></div>';
        };
    };

    function nextElementSibling(el) {
        if (el.nextElementSibling) return el.nextElementSibling;
        do { el = el.nextSibling } while (el && el.nodeType !== 1);
        return el;
    };

    function previousElementSibling(el) {
        if (el.previousElementSibling) return el.previousElementSibling;
        do { el = el.previousSibling } while (el && el.nodeType !== 1);
        return el;
    };

    function getArrNoClass(arr, noClass) {
        var l = arr.length,
            newArr = [];
        for (var i = 0; i < l; i++) {
            if ( !myHasClass( arr[i], noClass) ) newArr.push(arr[i]);
        };
        return newArr;
    };

    function myHasClass( target, className ) {
        if (target == null) {return false};
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
    };   

    var masonryObj = null;  // make it global;

	function doMasonry() {
        var browSize = getBrowserSize()
        var masWidthCol = getMasonryColumnSize(browSize);

        if (masonryObj != null) {
            masonryObj.destroy();
            masonryObj = null;
        };

        var masonryOptions = {
          itemSelector: '.grid-item',
          gutter: 18,
          fitWidth: true,
          columnWidth: masWidthCol    //'.grid-sizer'
        };
        var grid = document.getElementById('activity_container');
        var gridItem = grid.querySelectorAll('.grid-item');
        var msnry = new Masonry('.grid', masonryOptions);
        msnry.layout();
        masonryObj = msnry;
    };

    function getBrowserSize() {
        var myWidth = 0;
        if( typeof( window.innerWidth ) == 'number' ) {
            //Non-IE
            myWidth = window.innerWidth;
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
            //IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            //IE 4 compatible
            myWidth = document.body.clientWidth;
        };
        return myWidth;
    };



    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

	function renderList(dataToRend) {
		var data = dataToRend;

		var inputPlace =  document.getElementById('activity_container');   // куда вставлять картинки
		inputPlace.innerHTML = '';     // очистить старое содержимое

		var shablon = document.getElementById('make-activities').innerHTML;  // найти шаблон
		var actList = tmpl(shablon, data);
		inputPlace.innerHTML += actList;                     // добавить картинки

		// список картинок
        var elementsGrid = document.querySelectorAll('.grid-item');
        var sizes = [];
        var elemNum = elementsGrid.length;
        
        for (var i = 0; i < elemNum; i++) {
            var img = new Image();
            // после загрузки картинки узнать её размер
            img.onload = function(){
                var imgParam = {
                    width: this.width,
                    heigth: this.height,
                    src: this.src
                };
                sizes.push(imgParam);                    
            };
            // узнать адрес картинки
            img.src = elementsGrid[i].querySelectorAll('img')[0].src;            
        };        
        var checkLoad = setInterval(function() {
            if ( sizes[6] && sizes[6].width != 0 ) {
                clearInterval(checkLoad);
                // перебрать полученные размеры загруженных картинок                
                for (var count = 0; count < elemNum; count++) {   
                    // если ширина больше высоты
                    if (sizes[count].width > sizes[count].heigth) {

                        var searchImgSrc = sizes[count].src;  // какую картинку искать
                        
                        for (var imgIndex = 0; imgIndex < elemNum; imgIndex++) {

                            var currImgSrc = elementsGrid[imgIndex].querySelectorAll('img')[0].src;
                            if (currImgSrc === searchImgSrc) {
                                elementsGrid[imgIndex].classList.add('grid-item--width2');
                            }; 
                        };  
                    };
                };
                doMasonry();
            };
        }, 1);  
	};

// carousel

    function ie8getElementsByClass(classList, node) {
        var node = node || document, // узел, в котором ищем
            list = node.getElementsByTagName('*'),  // выбираем все дочерние узлы
            length = list.length, // количество дочерних узлов
            classArray = classList.split(/\s+/), // разбиваем список классов
            classes = classArray.length, // длина списка классов
            result = [], i,j;
        for(i = 0; i < length; i++) { // перебираем все дочерние узлы
            for(j = 0; j < classes; j++)  { //перебираем все классы
                if(list[i].className.search('\\b' + classArray[j] + '\\b') != -1) { // если текущий узел имеет текущий класс
                    result.push(list[i]); // запоминаем его
                    break; // прекращаем перебор классов
                };
            };
        };
        return result; // возвращаем набор элементов
    };


    function moveSlider(objectToMove, startPos, endPos, slideStep) {
        if (startPos === endPos) {
            objectToMove.style.left = endPos + 'px';
            return;
        };
        var fullMove = Math.abs(startPos - endPos);   // общая длина сдвига
        var slideIterr = fullMove/slideStep ^ 0;      // количество шагов
        var slowStart = 10;                           // замедлить старт
        var slowControl = slowStart;
        slideIterr += slowStart;
        var lastSteps = (slowControl/slideStep ^ 0);  // сколько последних шагов пропустить
        var i = startPos;
        var delta = ( startPos > endPos ) ? 1 : -1;   // определить направление
        var interval = setInterval(function() {
            if (slowStart == 0) {    // увеличить шаг до заданого после замедления
               delta *= slideStep;
            };
            slideIterr--;
            slowStart--;
            i -= delta;                          // местоположение
            objectToMove.style.left = i + 'px';
            if ( slideIterr == lastSteps ) {     // последние шаги=замедление пропустить
                clearInterval(interval);
                objectToMove.style.left = endPos + 'px';
            };
        }, 1);
        return;
    };



    function carousel(obj, start) {

        var sliderList = obj.getElementsByTagName('ul')[0];  //
        var slideItemList = obj.getElementsByTagName('li');  // найти все слайды

        var slideItemSize = slideItemList[0].offsetWidth;  // узнать ширину слайда
        var slideNum = slideItemList.length;          // сколько всего слайдов
        var sliderLength = slideItemSize * slideNum;  // ширина слайдера

        // найти кнопки управления
        if ('getElementsByClassName' in window) {     // если нормальный браузер
            var bntLeft = obj.getElementsByClassName('control_left')[0];
            var bntRight = obj.getElementsByClassName('control_right')[0];
        } else {                                      // если ie8
            var bntLeft = obj.querySelectorAll('.control_left')[0];
            var bntRight = obj.querySelectorAll('.control_right')[0];
        }

        // отразить стартовый слайд - start
        var startActNum = ( start < slideNum ? start : 0 );
        var currentLeftValue = - startActNum * slideItemSize;  // выставить положение стартового
        sliderList.style.left = currentLeftValue +'px';

        var currentNum =  startActNum;
        var minimumOffset = - (sliderLength - slideItemSize);
        var maximumOffset = 0;

        if (document.addEventListener) {                 // если нормальный браузер

            bntLeft.addEventListener('click', function () {
                if (currentLeftValue != maximumOffset) {
                    moveSlider(sliderList, currentLeftValue, currentLeftValue+slideItemSize, 2);
                    currentLeftValue += slideItemSize;
                    currentNum--;
                } else {
                    moveSlider(sliderList, currentLeftValue, minimumOffset, 20);
                    currentLeftValue = minimumOffset;
                    currentNum = slideNum - 1;
                }
            });

            bntRight.addEventListener('click', function () {
                if (currentLeftValue != minimumOffset) {
                    moveSlider(sliderList, currentLeftValue, currentLeftValue-slideItemSize, 2);
                    currentLeftValue -= slideItemSize;
                    currentNum++;
                } else {
                    moveSlider(sliderList, currentLeftValue, maximumOffset, 20);
                    currentLeftValue = maximumOffset;
                    sliderList.style.left = currentLeftValue +'px';
                    currentNum = 0;
                }
            });

            window.addEventListener("resize", function () {
                slideItemSize = slideItemList[0].offsetWidth;
                sliderLength = slideItemSize * slideNum;
                currentLeftValue = - currentNum * slideItemSize;
                sliderList.style.left = currentLeftValue +'px';
                minimumOffset = - (sliderLength - slideItemSize);
            });

        } else {

            bntLeft.attachEvent('onclick', function () {
                slideItemSize = slideItemList[0].offsetWidth;
                if (currentNum != 0) {
                    moveSlider(sliderList, -(currentNum)*slideItemSize, -(--currentNum)*slideItemSize, 10);
                } else {
                    moveSlider(sliderList, -(currentNum)*slideItemSize, -(slideNum-1)*slideItemSize, 50);
                    currentNum = slideNum - 1;
                }
            });

            bntRight.attachEvent('onclick', function () {
                slideItemSize = slideItemList[0].offsetWidth;
                if (currentNum != (slideNum-1)) {
                    moveSlider(sliderList, -(currentNum)*slideItemSize, -(++currentNum)*slideItemSize, 10);
                } else {
                    moveSlider(sliderList, -(currentNum)*slideItemSize, maximumOffset, 50);
                    currentNum = 0;
                }
            });

            obj.attachEvent('onresize', function(){
                slideItemSize = slideItemList[0].offsetWidth;
                currentLeftValue = - (currentNum * slideItemSize);
                sliderList.style.left = currentLeftValue +'px';
            });
        }
    };


    function getDevType(screenWidth) {
        var deviceType;
         if (screenWidth < 768) {
            deviceType = "mob";
        } else if (screenWidth >= 768 && screenWidth < 1440) {
            deviceType = "tabl";
        } else {
            deviceType = "desk";
        };
        return deviceType;
    };

    function getMasonryColumnSize(winSize) {
        var columnWidthRet;
        if (winSize < 768) {
            columnWidthRet = 300;
        } else if (winSize >= 768 && winSize < 1440) {
            columnWidthRet = 236;
        } else {
            columnWidthRet = 300;
        };
        return columnWidthRet;
    };

// управление
    var jsonData;
   
 window.onload = function() {

    // alert( 'Документ и все ресурсы загружены' );
    var firstJSONmobile = '{"images":[{"imageurl":"./img/act1-mob.jpg","word":"Sport and Activity"},{"imageurl":"./img/act2-mob.jpg","word":"Wellnes and Health"},{"imageurl":"./img/act3-mob.jpg","word":"Extreme Sports and Expeditions"},{"imageurl":"./img/act4-mob.jpg","word":"Games"},{"imageurl":"./img/act5-mob.jpg","word":"Culture and Education"},{"imageurl":"./img/act6-mob.jpg","word":"Relaxation"},{"imageurl":"./img/act7-mob.jpg","word":"Travelling"}],"status":"success","count":7}';
    var firstJSONtablet = '{"images":[{"imageurl":"./img/act1-tab.jpg","word":"Sport and Activity"},{"imageurl":"./img/act2-tab.jpg","word":"Wellnes and Health"},{"imageurl":"./img/act3-tab.jpg","word":"Extreme Sports and Expeditions"},{"imageurl":"./img/act4-tab.jpg","word":"Games"},{"imageurl":"./img/act5-tab.jpg","word":"Culture and Education"},{"imageurl":"./img/act6-tab.jpg","word":"Relaxation"},{"imageurl":"./img/act7-tab.jpg","word":"Travelling"}],"status":"success","count":7}';
    var firstJSONdesktop = '{"images":[{"imageurl":"./img/act1-des.jpg","word":"Sport and Activity"},{"imageurl":"./img/act2-des.jpg","word":"Wellnes and Health"},{"imageurl":"./img/act3-des.jpg","word":"Extreme Sports and Expeditions"},{"imageurl":"./img/act4-des.jpg","word":"Games"},{"imageurl":"./img/act5-des.jpg","word":"Culture and Education"},{"imageurl":"./img/act6-des.jpg","word":"Relaxation"},{"imageurl":"./img/act7-des.jpg","word":"Travelling"}],"status":"success","count":7}';

    var firstRendData,
        browSize = getBrowserSize(),
        newBrowSize,
        devType = getDevType(browSize),
        newDevType,
        columnMasonry = getMasonryColumnSize(browSize),
        activityToFind;

    if (browSize < 768) {
        firstRendData = firstJSONmobile;
    } else if (browSize >= 768 && browSize < 1440) {
        firstRendData = firstJSONtablet;
    } else {
        firstRendData = firstJSONdesktop;
    };

    jsonData = JSON.parse(firstRendData);
    makeRandomData(jsonData);  // перемешать начальные данные
    renderList(jsonData);   
    doMasonry();

    var form = document.getElementById('discover');

    if('XDomainRequest' in window && window.XDomainRequest !== null) {
            ie8shadowAdd("body");
            form.attachEvent('onsubmit', function(event) {
                event.returnValue = false;
                activityToFind = document.getElementById('interests').value;
                document.getElementById('interests').value = '';
                takeNewData(activityToFind);
                return false;});
            window.attachEvent('onresize', function(){
                newBrowSize = getBrowserSize();
                newDevType = getDevType(newBrowSize);
                if (newDevType != devType) {
                    devType = newDevType;
                    browSize = newBrowSize;                    
                    renderList(jsonData);                    
                    doMasonry();
                }
            });

        }  else {
            form.onsubmit = function(event) {
                event.preventDefault();
                activityToFind = document.getElementById('interests').value;
                document.getElementById('interests').value = '';
                takeNewData(activityToFind);
                };
            window.addEventListener("resize", function () {
                newBrowSize = getBrowserSize();
                newDevType = getDevType(newBrowSize);
                if (newDevType != devType) {
                    devType = newDevType;
                    browSize = newBrowSize;                    
                    renderList(jsonData);                    
                    doMasonry();
                }
            });
        };

    // carousel

    var sliderBlock, allSliders;
    sliderBlock = document.getElementById("sliderBlock");

    if (document.getElementsByClassName) {
            allSliders = sliderBlock.getElementsByClassName("slider");
    } else { // если родной функции нет, то будем обходить DOM
        allSliders = ie8getElementsByClass("slider", sliderBlock);
    };

    var carousel1 = new carousel(allSliders[0], 0);
    var carousel2 = new carousel(allSliders[1], 1);
    var carousel3 = new carousel(allSliders[2], 2);

};








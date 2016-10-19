
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
                            var data = JSON.parse(xhr.responseText);                        
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

    var _eventHandlers = {}; // somewhere global

    function addListener(node, event, handler, capture) {
        if(!(node in _eventHandlers)) {
            // _eventHandlers stores references to nodes
            _eventHandlers[node] = {};
        }
        if(!(event in _eventHandlers[node])) {
            // each entry contains another entry for each event type
            _eventHandlers[node][event] = [];
        }
        // capture reference
        _eventHandlers[node][event].push([handler, capture]);       

        if (document.addEventListener) {
            node.addEventListener(event, handler, capture);
        } else {            
            node.attachEvent('on'+event, handler, capture);
        }

    };

    function removeAllListeners(node, event) {
        if(node in _eventHandlers) {
            var handlers = _eventHandlers[node];
            if(event in handlers) {
                var eventHandlers = handlers[event];
                for(var i = eventHandlers.length; i--;) {
                    var handler = eventHandlers[i];                    
                    if (document.removeEventListener) {
                        node.removeEventListener(event, handler[0], handler[1]);
                    } else {
                        node.detachEvent('on'+event, handler[0], handler[1]);
                    }
                }
            }
        }
    };

	function doMasonry() {
        var masonryOptions = {
          itemSelector: '.grid-item',
          gutter: 18,
          fitWidth: true,
          columnWidth: '.grid-sizer'
        };

        var grid = document.getElementById('activity_container');
        var gridItem = grid.querySelectorAll('.grid-item');

        var msnry = new Masonry('.grid', masonryOptions);
        msnry.layout();
       
        addListener(grid,'click', function(event) {
            var ev = event || window.event;
            var target = ev.target || ev.srcElement; 
            var pressObj = target.parentNode;
            var isGridSizer = myHasClass(pressObj, 'grid-sizer');
            var isGridItem = myHasClass(pressObj, 'grid-item');

            if ( isGridSizer || !isGridItem ) return;                                 
            var isGridItemWidth2 = myHasClass( pressObj, 'grid-item--width2');          

            if ( isGridItemWidth2 ) {     // нажали на большую                
                var smallPict = getArrNoClass( gridItem, 'grid-item--width2');
                var randChPic = getRandomInt(1,3);
                smallPict[randChPic].classList.toggle('grid-item--width2');

			} else {                   // нажали на маленькую                
				var bigPict = grid.querySelectorAll('.grid-item--width2');
                var prevItem = previousElementSibling(pressObj);
                var isLastGrid = myHasClass( pressObj, 'grid-last');
                var isPrevItemWidth2 = myHasClass( prevItem, 'grid-item--width2');

	        	    // на последнюю и предпосленяя большая
                if ( isLastGrid && isPrevItemWidth2 ) {
	        		bigPict[1].classList.toggle('grid-item--width2');

	        	} else {
                    var nextItem = nextElementSibling(pressObj);
                    var gridLast = grid.querySelectorAll('.grid-last')[0];
                    var isLastGridWidth2 = myHasClass(gridLast, 'grid-item--width2');
                    var isNextItemWidth2 = myHasClass(nextItem, 'grid-last');

					  // на предпоследнюю и последняя большая
                    if ( isNextItemWidth2 && isLastGridWidth2 ) {
        			  // уменьшить последнюю
                        gridLast.classList.toggle('grid-item--width2');
	        		} else {
	        			bigPict[0].classList.toggle('grid-item--width2');
	        		}
	        	}
			};

            pressObj.classList.toggle('grid-item--width2');
	        // trigger layout after item size changes

            msnry.layout();
        }, false);
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

	function renderList(JSONdata) {
		var data = JSONdata;             
		var inputPlace =  document.getElementById('activity_container');   // куда вставлять картинки
		inputPlace.innerHTML = '';     // очистить старое содержимое
        removeAllListeners(inputPlace, 'click'); // очистить ивенты

		var shablon = document.getElementById('make-activities').innerHTML;  // найти шаблон
		var actList = tmpl(shablon, data);
		inputPlace.innerHTML += actList;                     // добавить картинки

		// список картинок		
        var elementsGrid = document.querySelectorAll('.grid-item');

		elementsGrid[0].classList.add('grid-sizer');     // первая картинка - стандарт колонок
		elementsGrid[6].classList.add('grid-last');

		var itemLeft = 2;                // случайные две картинки сделать двойным размером
		do {
			var makeBigIndex = getRandomInt(1, 5);  // но не первую - она стандарт
			  										// не последнюю - замыкающая
            if(!myHasClass(elementsGrid[makeBigIndex], 'grid-item--width2')) {
				elementsGrid[makeBigIndex].classList.add('grid-item--width2');
				itemLeft--;
			};
		} while (itemLeft != 0);
        return true;
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


// управление

 window.onload = function() {

    // alert( 'Документ и все ресурсы загружены' );
    var firstJSONtext = '{"images":[{"imageurl":"./img/act1.jpg","word":"Sport and Activity"},{"imageurl":"./img/act2.jpg","word":"Wellnes and Health"},{"imageurl":"./img/act3.jpg","word":"Extreme Sports and Expeditions"},{"imageurl":"./img/act4.jpg","word":"Games"},{"imageurl":"./img/act5.jpg","word":"Culture and Education"},{"imageurl":"./img/act6.jpg","word":"Relaxation"},{"imageurl":"./img/act7.jpg","word":"Travelling"}],"status":"success","count":7}';
    var jsonData = JSON.parse(firstJSONtext);
    var activityToFind;

    makeRandomData(jsonData);  // перемешать начальные данные
    renderList(jsonData);  

    // на старте отцентрировать картинки
    var gridItem = document.querySelectorAll('.grid-item');    
    for (var imgCount = 0 ; imgCount < gridItem.length; imgCount++) {
        var imgAtStart = gridItem[imgCount].getElementsByTagName("img")[0];
        imgAtStart.classList.add('img_first');
    };
    
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

        }  else {
            form.onsubmit = function(event) {
                event.preventDefault();
                activityToFind = document.getElementById('interests').value;
                document.getElementById('interests').value = '';
                takeNewData(activityToFind);
                }
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








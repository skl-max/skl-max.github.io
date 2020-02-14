$(function(){
  // 是否产生新的数字(项目)
  var isNewRndItem = false;
  // 最高纪录
  var maxScore = 0;
  // 查看本地缓存中是否有保存以前的最高纪录
  if(localStorage.maxScore){
    maxScore = localStorage.maxScore-0;
  }
  // 当前游戏的得分
  var gameScore = 0;

  gameInit();

  function gameInit(){
    console.log("游戏开始");
    $("#maxScore").html(maxScore);
    $("#gameScore").html(gameScore);
    newRndItem();
    newRndItem();
    refreshColor();
  }

  // 生成随机数
  function newRndItem(){
    var nums = [2,4];
    var i = Math.floor(Math.random()*2);
    var num = nums[i];
    // 将随机数放入页面的空白位置
    // 拿到所有的空白格
    var emptyItems = $(".emptyItem");
    i = Math.floor(Math.random()*emptyItems.length);
    // console.log(i);
    emptyItems.eq(i).html(num).removeClass("emptyItem").addClass("nonEmptyItem");
  }

  // 刷新背景色
  function refreshColor(){
    var items = $(".item");
    for(var i=0;i<items.length;i++){
      var num = items[i].innerHTML;
      switch(num){
        case "": 
          items.eq(i).css("background","");
          break;
        case "2": 
          items.eq(i).css("background","rgb(250,250,150)");
          break;
        case "4": 
          items.eq(i).css("background","rgb(250,150,250)");
          break;
        case "8": 
          items.eq(i).css("background","rgb(227,172,127)");
          break;
        case "16": 
          items.eq(i).css("background","rgb(233,233,90)");
          break;
        case "32": 
          items.eq(i).css("background","rgb(150,50,100)");
          break;
        case "64": 
          items.eq(i).css("background","rgb(200,100,80)");
          break;
        case "128": 
          items.eq(i).css("background","rgb(100,50,100)");
          break;
        case "256": 
          items.eq(i).css("background","rgb(200,100,180)");
          break;
        case "512": 
          items.eq(i).css("background","rgb(240,80,200)");
          break;
        case "1024": 
          items.eq(i).css("background","rgb(100,150,140)");
          break;
        case "2048": 
          items.eq(i).css("background","rgb(180,180,150)");
          break;
        case "4096": 
          items.eq(i).css("background","rgb(130,80,50)");
          break;
      }
    }
  }

  // 获取四周的元素
  // currentItem: 当前元素(jq对象)
  // direction: 移动的方向(left,up,right,down)
  function getSideItem(currentItem,direction){
    // 获取当前元素的坐标位置
    var currentItemX = currentItem.attr("x")-0;
    var currentItemY = currentItem.attr("y")-0;
    var sideItemX, sideItemY;
    switch(direction){
      case "left":
        sideItemX = currentItemX;
        sideItemY = currentItemY-1;
        break;
      case "up":
        sideItemX = currentItemX-1;
        sideItemY = currentItemY;
        break;
      case "right":
        sideItemX = currentItemX;
        sideItemY = currentItemY+1;
        break;
      case "down":
        sideItemX = currentItemX+1;
        sideItemY = currentItemY;
        break;
    }
    // 获取旁边的元素
    return $(".x"+sideItemX+"y"+sideItemY);
  }

  // 某个格子的移动
  function itemMove(currentItem,direction){
    // 获取旁边的元素
    var sideItem = getSideItem(currentItem,direction);
    // 判断旁边元素的情况
    if(sideItem.length==0){
      // 在最边上,不需要动
    }else if(sideItem.html()==""){
      // 对应方向上是一个空格,将当前元素移动到该空格位置
      sideItem.html(currentItem.html()).removeClass("emptyItem").addClass("nonEmptyItem");
      // 清空当前位置的数字
      currentItem.html("").removeClass("nonEmptyItem").addClass("emptyItem");
      itemMove(sideItem,direction);
      isNewRndItem = true;
    }else if(sideItem.html()!=currentItem.html()){
      // 与对应边的相邻元素不一样,不动
    }else{
      // 与相邻元素相同,和相邻元素相加,当前元素清空
      sideItem.html((sideItem.html()-0)*2);
      currentItem.html("").removeClass("nonEmptyItem").addClass("emptyItem");
      // 加分
      gameScore += (sideItem.html()-0)*10;
      // 更新得分
      $("#gameScore").html(gameScore);
      // 判断当前得分有没有超过历史最高分
      // maxScore = maxScore<gameScore?gameScore:maxScore;
      if(gameScore>maxScore){
        maxScore = gameScore;
      }
      localStorage.setItem("maxScore",maxScore);
      isNewRndItem = true;
    }
  }

  // 所有格子移动
  function move(direction){
    // 获取所有有数字的元素
    var items = $(".nonEmptyItem");
    // 向左或上,正向遍历,否则反向遍历
    if(direction=="left"||direction=="up"){
      for(var i=0;i<items.length;i++){
        itemMove(items.eq(i),direction);
      }
    }else{ // 向下或右边移动,反向遍历
      for(var i=items.length-1;i>=0;i--){
        itemMove(items.eq(i),direction);
      }
    }
    // 根据isNewRndItem的值来判定是否生成新元素
    if(isNewRndItem){
      newRndItem();
      refreshColor();
      isNewRndItem = false;
    }
  }

  // 监听键盘按键事件
  $("body").keydown(function(e){
    // console.log(e.keyCode);
    var code = e.keyCode;
    switch(code){
      case 37:
        // console.log("left");
        move("left");
        break;
      case 38:
        // console.log("up");
        move("up");
        break;
      case 39:
        // console.log("right");
        move("right");
        break;
      case 40:
        // console.log("down");
        move("down");
        break;
    }
  });
});
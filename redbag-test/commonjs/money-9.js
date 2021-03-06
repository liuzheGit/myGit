$(document).ready(function(){
	function bodyScale(){
		var devicewidth=document.documentElement.clientWidth;
		var scale=devicewidth/640;
		document.body.style.zoom=scale;
	}	
	window.onload=window.onresize=function(){
		bodyScale();
		$('html,body').show();
		reloadIscroll();
	}
	var myScroll=new IScroll('#wrapper',{
		vScroll:false,
        hScrollbar:false,
        snap:false
	})
	function reloadIscroll(){
		setTimeout(function(){myScroll.refresh()},500)
	}
	var person_id=localStorage.getItem('person_id')
	
	$.createHTML=function(selecter,data){
		var temp=$(selecter).html().replace(eval("/<!--/gi"),'').replace(eval("/-->/gi"),'');
		for(var c in data){
			temp=temp.replace(eval("/<data"+c+">/gi"),data[c]);
			}
		return temp;
	}
	$.ajax({
		type:"post",
		url:'https://guaiguaixueche.com/ggxc/who',
		dataType:'json',
		contentType:'application/json;charset=utf-8',
		success:function(data){
			getVideo(data.ip)
		}		
	})
	
	function getVideo(path){
		var path=hex_md5(path);
		$.ajax({
			type:'post',
			url:'https://guaiguaixueche.com/ggxc/userinfo',
			data:'{"rnd":"'+path+'","user":"'+person_id+'","type":"'+1+'"}',
			dataType:'json',
			contentType:'application/json;charset=utf-8',
			success:function(data){
				if(data.ret.code==0){
					var money=data.money;
					$('.money-total').html(money);
					var list=data.money_list;
					for(var i=0;i<list.length;i++){
						$('#list-box').append($.createHTML("#money-list",list[i]));
						if(list[i].type==1){
							$('.money-home').eq(i).html('(注册红包)');
						}else if(list[i].type==2){
							$('.money-home').eq(i).html('(推荐红包)');
						}else if(list[i].type==3){
							$('.money-home').eq(i).html('');
						}
					}
					reloadIscroll();	
				}else{
					$('.none-msg').css('display','block')
				}
				
			}
		})
	}
	
var date=new Date();
var day=date.getDay();
var hour=date.getHours();
if(day==2&&hour>=8&&hour<17){
	$('.for-cash-btn').css('background','#F1A653'); 
}else{
	$('.for-cash-btn').css('background','#bbb');	
}
//var person_id=localStorage.getItem('person_id');
var openid=localStorage.getItem('Aopenid');
$('.for-cash-btn').on('tap',function(){
	if(localStorage.getItem('person_id')){
		if(day==2&&hour>=8&&hour<17){
			$('.money-bg').css('display','block');
			$('.how-much-box').css('display','block');
		}else{
			alert('每周二的早8：00-晚17：00才可以提现的哦');
		}
	}else{
		alert('请先登录，才可以提现');
		window.open('../../html/loginReg_html/login.html','_self');
	}	
})
function draw(money){
	$('#sure').on('tap',function(){
		var cash=$('.much-txt').val();
		if(cash<0){
			alert('提现金额不能为小于0')
		}else if (cash>money){
			alert('提现金额不能大于您钱包的总金额')
		}else{
			$.ajax({
				type:'post',
				url:'https://guaiguaixueche.com.cn/api/withdraw',
				data:{person_id:person_id,openid:openid,money:cash},
				dataType:'json',
				success:function(data){
					if(data.code=='success'){
						alert('提现成功，请稍后到微信钱包查看!');
						window.location.reload();
					}else if(data.code=='fail'){
						alert(data.content);
					}else{
						alert('提现失败！请联系客服人员');
					}
				}
			})
		}
	})
}

$('#quit').on('tap',function(){
	$('.money-bg').css('display','none');
	$('.how-much-box').css('display','none');
})
$('.money-bg').on('tap',function(){
	$('.money-bg').css('display','none');
	$('.how-much-box').css('display','none');
})

})
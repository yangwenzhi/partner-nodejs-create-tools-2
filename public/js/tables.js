$(document).ready(function() {
    //  自由拖拽
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();

    $('table').on('click','input', function(){
        var self = $(this).parents('tr');
        self.hasClass('select') ? self.removeClass('select') : self.addClass('select');
    });
    $('.type-x').on('click', function(){
        $('#type').val($(this).find('input').val());
    });
    $('.dialogue-close').click(function(){
    	$('.mask').hide();
    	$('.mask-two').hide();
        $('#dialogue1').hide();
        $('#dialogue2').hide();
        $('#dialogue3').hide();
        $('.dialogue-box iframe').attr('src', '');
        $("#partner").val("");
        $("#addtitle").val("");
        $("#addlink").val("");
        $("#addurl").val("");
        $('#dialogueSave').attr('data-id', '');
    });
    $('#dialogueCancel').click(function(){
    	$('.mask').hide();
        $('#dialogue1').hide();
        $('#dialogue2').hide();
        $("#addtitle").val("");
        $("#addlink").val("");
        $("#addurl").val("");
        $('#dialogueSave').attr('data-id', '');
    });
    $('table').on('click','.editicon', function(){
        var me = $(this).parents('tr').find('td');
        $('#dialogueSave').attr('data-id', me.eq(0).attr('id'));
        $("#addtitle").val(me.eq(2).html());
        $("#addlink").val(me.eq(3).html());
        $("#addurl").val(me.eq(1).find('img').attr('src'));
        $('#edit_title').html('Edit icon');
        $('.mask').show();
        $('#dialogue2').show();
    });
    $("#addicon").click(function(){
    	$('#edit_title').html('Add icon');
		$('.mask').show();
        $('#dialogue2').show();
	});

    $('#sortable').on('mouseenter','li', function(){
        var self = $(this).find('.delete');
        self.show();
    });
    $('#sortable').on('mouseleavse','li', function(){
        var self = $(this).find('.delete');
        self.hide();
    });
    $('#sortable').on('click','.delete', function(){
        var self = $(this).parents('li');
        self.remove();
    });
    $('#createcode').click(function(){
        if(!$('table .select').size()) return;
        var itemData = [];
        $('table .select').each(function(){
        	var me = $(this).find('td');
        	itemData.push({
        		"id": me.eq(0).attr('id'),
        		"title": me.eq(2).html(),
        		"link": me.eq(3).html(),
        		"url" : me.eq(1).find('img').attr('src')
        	});
        });
        var tmpl = $("#grid-item").html();
	    var doTtmpl = doT.template(tmpl);
	    $("#sortable").empty().append(doTtmpl(itemData));

        $('.mask').show();
        $('#dialogue1').show();
    });
	
	$('#dialogueSave').click(function(){
        if($.trim($("#addtitle").val()) == "") {
        	alert('Please fill in Title');
        	return;
        }
        if($.trim($("#addlink").val()) == "") {
        	alert('Please fill in Link');
        	return;
        }
        if($.trim($("#addurl").val()) == "") {
        	alert('Please fill in Url');
        	return;
        }

        var id = $('#dialogueSave').attr('data-id');
        if(id){
        	$.ajax({
	        	type: "POST",
				url: "/api/data/edit/",
				data: {
					"id": id,
					"title": $("#addtitle").val(),
					"link": $("#addlink").val(), 
					"url": $("#addurl").val()
				},
				success: function(data){
					if(data.status){
						alert('Edited successfully');
						location.replace(location.href);
					}
				}
			});
        }
        else{
        	$.ajax({
	        	type: "POST",
				url: "/api/data/add",
				data: {
					"title": $("#addtitle").val(),
					"link": $("#addlink").val(), 
					"url": $("#addurl").val()
				},
				success: function(data){
					if(data.status){
						alert('Added successfully');
						location.replace(location.href);
					}
				}
			});
        }

    });

	$('#checkout').click(function(){
        preView();
    });

	$('#createcodeed').click(function(){
		preView(1);
	});
    
});

function preView(dir){
	if(!$('#sortable li').size()) return;
    if($.trim($("#partner").val()) == "") {
    	alert('Please fill in Partner');
    	return;
    }
    var itemData = [];
    $('#sortable li').each(function(){
    	var me = $(this);
        itemData.push(me.attr('data-id'));
    });

    $.ajax({
    	type: "POST",
		url: "/api/data/checkout",
		data: {
			"itemData": itemData.join(","),
			"type": $("#type").val() || 1,
			"width": $("#width").val() || 660, 
			"height": $("#height").val() || 178, 
			"number": itemData.length || 14, 
			"partner": $("#partner").val() || "v9",
			"author":"dazhi"
		},
		success: function(data){
			if(data.status){
				$('#showicon').attr('src', '/checkout?' + new Date().getTime());
				if(dir) createCodeBlock();
			}
		}
	});
}

function createCodeBlock(){
	var partner = $("#partner").val() || "v9";
	var code = '<!--code script 1 start-->\n';
	code += '<div id="elexHotZone"></div>\n';
	code += '<script id="elexHotZoneScript" src="http://pub.v9.com/partner/js/'+partner+'.js?t='+new Date().getTime()+'"></script>\n';
	code += '<!--code script 1 end-->\n\n';
	code += '<!--code script 2 start-->\n';
	code += '<div id="elexHotZone"></div>\n';
	code += '<script id="elexHotZoneScript"></script>\n';
	code += '<script>document.getElementById("elexHotZoneScript").src ="http://pub.v9.com/partner/js/'+partner+'.js?t=" + new Date().getTime();</script>\n';
	code += '<!--code script 2 end-->\n';

	$.ajax({
    	type: "GET",
		url: "/api/data/uploadfile/"+partner,
		success: function(data){
			if(data.status){
				$('.mask-two').show();
			    $('#dialogue3').show();
			    $('#showCodeBlock').val(code);
			}
		},
		error:function(){
			alert('Code fails');
		}
	});
}

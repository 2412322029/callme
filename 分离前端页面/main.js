basurl = "http://127.0.0.1:5000/"
page = 1
limit = 5
var m = mdui.$;
var inst = new mdui.Dialog('#dialog');
var draw = new mdui.Drawer('#drawer');
var tooltip = new mdui.Tooltip(".tooltip");
getcount()
loadnew(1, limit)
function getTime(timestamp) {
    var date = new Date(parseInt(timestamp) * 1000);//时间戳为13位的话需要parseInt下
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
}
function copytocpil() {
    $('.copy').on('click', function () {
        copy_data = $(this).attr("data-copy")
        console.log("复制到剪切板->" + copy_data);

        var aux = document.createElement("input");
        aux.setAttribute("value", copy_data);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        mdui.snackbar({
            message: "链接已复制到剪切板",
            position: 'top'
        });
        document.body.removeChild(aux);
    });
}

$('#dialog-close').on('click', function () {
    inst.close();
});
$('#email').on('click', function () {
    $("#dialog-title").text("Hello")
    $("#dialog-content").text("2412322029@qq.com")
    inst.open();
});
$('#drawer-option').on('click', function () {
    draw.toggle();
});
$("#refresh").on('click', function () {
    $("#comment-block").html(``)
    loadnew(1, limit)
});

$('#more').on('click', function () {
    loadnew(page * limit, page * limit + limit)
    page++
    getcount()

});
$('#creat').on('click', function () {
    $("#comment-block").fadeOut(200)
    $("#history").fadeOut(200)
    $("#aboutme").fadeOut(200)

    $("#input-block").fadeIn()
});
$('#tohome').on('click', function () {
    $("#comment-block").fadeIn()
    $("#history").fadeIn()

    $("#input-block").fadeOut(200)
    $("#aboutme").fadeOut(200)
});
$('#about').on('click', function () {
    $("#comment-block").fadeOut(200)
    $("#history").fadeOut(200)
    $("#input-block").fadeOut(200)

    $("#aboutme").fadeIn()
});
$("#sub").click(function () {
    pname = $("#pname").val()
    avatar = $("#avatar").val()
    title = $("#title").val()
    pdata = $("#pdata").val()
    imgurl = $("#imgurl").val()

    strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www. 
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名 
        + "[a-z]{2,6})" // first level domain- .com or .museum 
        + "(:[0-9]{1,4})?" // 端口- :80 

    var re = new RegExp(strRegex);
    if (pname == undefined || pdata == undefined || title == undefined
        || pname == "" || pdata == "" || title == "") {
        mdui.snackbar({
            message: '不能为空',
            position: 'top'
        });

    } else if (pname.length >= 20 || pdata.length > 1000 || title.length > 30) {
        mdui.snackbar({
            message: '文本太长',
            position: 'top'
        });
    } else if (avatar == "" && imgurl != "" && re.test(imgurl) == true) {
        sentmsg(pname, "", title, pdata, imgurl, "withimg")
    } else if (imgurl == "" && avatar != "" && re.test(avatar) == true) {
        sentmsg(pname, avatar, title, pdata, "", "noimg")
    } else if (imgurl == "" && avatar == "") {
        sentmsg(pname, "", title, pdata, "", "noimg")
    } else if (re.test(avatar) == false || re.test(imgurl) == false) {
        mdui.snackbar({
            message: 'url形式不正确',
            position: 'top'
        });
    } else {
        sentmsg(pname, avatar, title, pdata, imgurl, "withimg")
    }

});
function sentmsg(pname, avatar, title, pdata, imgurl, ptype) {
    pdata = pdata.replace(/[\n\r]/g, '<br>')
    console.log(pdata);
    $.ajax({
        url: basurl + "/api/addmsg",
        data: { "name": pname, "avatar": avatar, "title": title, "data": pdata, "imgurl": imgurl, "type": ptype },
        type: "post",
        error: function () {
            mdui.snackbar({
                message: "网络故障，发送失败",
                position: 'top'
            });

        },
        success: function (result) {
            code = result["code"]
            msg = result["msg"]
            if (code == 200) {
                mdui.snackbar({
                    message: msg,
                    position: 'top'
                });
                loadnew(1, 1)
                copytocpil()

            } else {
                mdui.snackbar({
                    message: "发送失败：" + msg,
                    position: 'top'
                });
            }

        }

    });
}
function getcount() {
    $.ajax({
        url: basurl + "/api/getcount",
        type: "get",
        error: function () {
            mdui.snackbar({
                message: "网络故障，发送失败",
                position: 'top'
            });

        },
        success: function (count) {
            count = count["count"]
            if (count - page * limit > 0) {
                $("#have_count").text(count - page * limit + "   总共: " + count)
            } else {
                $("#have_count").text(0 + "  总共: " + count)
            }

            return count
        }

    });
}


function loadnew(n, m) {
    $("body").before(`<div class="mdui-progress" id="loading" style="z-index: 2000;top: 64px;position: fixed;">
    <div class="mdui-progress-indeterminate"></div>
    </div>`)
    $.ajax({
        url: basurl + "/api/showmsgNearNow",
        data: { "m": m, "n": n },
        type: "GET",
        error: function () {
            mdui.snackbar({
                message: "网络故障,加载失败",
                position: 'top'
            });
            $("#loading").remove()
        },
        success: function (result) {
            code = result["code"]
            msg = result["msg"]
            if (code == 200) {
                setTimeout(function () {
                    $("#loading").remove()
                }, 500)
                data = result["data"]
                count = data.length
                if (count == 0) {
                    mdui.snackbar({
                        message: "没有数据了",
                        position: 'top'
                    });
                } else {
                    // console.log(code, msg, data, count)
                    for (i = 0; i < data.length; i++) {
                        if (data[i]["avatar"] == "") {
                            str = loopcard(data[i]["name"], "https://i.imgtg.com/2022/10/15/J7QcN.png", getTime(data[i]["time"])
                                , data[i]["title"], data[i]["data"], data[i]["imgurl"], data[i]["id"] ,data[i]["type"])
                            $("#comment-block").append(str)
                        } else {
                            str = loopcard(data[i]["name"], data[i]["avatar"], getTime(data[i]["time"])
                                , data[i]["title"], data[i]["data"], data[i]["imgurl"], data[i]["id"] ,data[i]["type"])
                            $("#comment-block").append(str)
                        }

                    }
                    mdui.snackbar({
                        message: count + "条数据加载成功,return: " + msg,
                        position: 'top',
                        timeout:"500"
                    });
                    copytocpil()
                }
            } else {
                mdui.snackbar({
                    message: "数据拉取失败：" + msg,
                    position: 'top'
                });
            }

        }
    });
}
function showbypage(p, l) {
    $("body").before(`<div class="mdui-progress" id="loading" style="z-index: 2000;top: 64px;position: fixed;">
    <div class="mdui-progress-indeterminate"></div>
    </div>`)
    $.ajax({
        url: basurl + "/api/showmsg",
        data: { "p": p, "l": l },
        type: "GET",
        error: function () {
            mdui.snackbar({
                message: "网络故障,加载失败",
                position: 'top'
            });
            $("#loading").remove()
        },
        success: function (result) {
            code = result["code"]
            msg = result["msg"]
            if (code == 200) {
                setTimeout(function () {
                    $("#loading").remove()
                }, 500)
                data = result["data"]
                allcount = result["count"]
                for (i = 0; i < data.length; i++) {
                    // console.log(data[i]["name"], data[i]["avatar"], getTime(data[i]["time"])
                    // , data[i]["title"], data[i]["data"], data[i]["imgurl"], data[i]["id"]);
                    str = addtable(data[i]["name"], data[i]["avatar"], getTime(data[i]["time"])
                        , data[i]["title"], data[i]["data"], data[i]["imgurl"], data[i]["id"], data[i]["type"])
                    $("#addtable").append(str)
                }
            } else {
                mdui.snackbar({
                    message: "数据拉取失败：" + msg,
                    position: 'top'
                });
            }

        }
    });
}
function delmsg(n, DelPasswd) {
    $.ajax({
        url: basurl + "/api/delmsg",
        data: { "n": n, "DelPasswd": DelPasswd },
        type: "GET",
        error: function () {
            mdui.snackbar({
                message: "网络故障,请求失败",
                position: 'top'
            });
        },
        success: function (result) {
            code = result["code"]
            msg = result["msg"]
            if (code == 200) {
                mdui.snackbar({
                    message: msg,
                    position: 'top'
                });

            } else {
                mdui.snackbar({
                    message: msg + ", code:" + code,
                    position: 'top'
                });
            }


        }
    });
}




function loopcard(pname, avatar, ptime, ptitle, pcontent, imgurl, id ,type) {
    return `
        <div id="card-${id}" class="mdui-card mdui-hoverable mdui-center" style="margin-bottom: 50px;width:90%;max-height:2000px ;border-radius: 8px">
                <div class="mdui-card-header">
                <div class="mdui-card-header-subtitle mdui-float-right">id=${id}</div>
                    <img class="mdui-card-header-avatar" src="${avatar}" content="no-referrer" alt="" onerror="javascript:this.src='https://i.imgtg.com/2022/10/15/J7QcN.png'">
                    <div class="mdui-card-header-title">${pname}</div>
                    <div class="mdui-card-header-subtitle">${ptime}</div>
                </div>
                        <div class="mdui-card-media">
                            
                            <img style="max-height: 800px" src="${imgurl}" content="no-referrer" alt="" onerror="imgerr(${id},'${type}');" id="imgbar-${id}" >
                            
                        </div>
                <div class="mdui-card-primary">
                    <div class="mdui-card-primary-title">${ptitle}</div>
                </div>
                <div class="mdui-card-content">${pcontent}</div>
                <div class="mdui-card-actions">

                    <div id="like-${id}" class="mdui-float-right mdui-card-primary-subtitle ">0</div>
                    <button id="addlike-${id}" type="button" class="mdui-btn mdui-btn-icon mdui-float-right tooltip" mdui-tooltip="{content: '点赞', position: 'auto'}" >
                        <i class="mdui-icon material-icons">favorite</i>
                    </button>
                    
                    <div id="comment-${id}" class="mdui-float-right mdui-card-primary-subtitle">0</div>
                    <a target="_blank"  href="./card.html?c=${id}" class="mdui-btn mdui-btn-icon mdui-float-right tooltip" mdui-tooltip="{content: '评论', position: 'auto'}">
                        <i class="mdui-icon material-icons">comment</i>
                    </a>

                    <button type="button" class="copy mdui-btn mdui-btn-icon mdui-float-right tooltip" data-copy="${"http://" + location.host}/card.html?c=${id}" mdui-tooltip="{content: '点击复制分享链接', position: 'auto'}">
                        <i class="mdui-icon material-icons">share</i>
                    </button>


                </div>
            </div>`
}


function addtable(pname, avatar, ptime, ptitle, pcontent, imgurl, id, type) {
    return `
    <tr>
                    <th>${id}</th>
                    <th><img class="mdui-card-header-avatar" src="${avatar}" content="no-referrer" alt="" onerror="javascript:this.src='https://i.imgtg.com/2022/10/15/J7QcN.png'";>
                    <div style="margin-top: 10px;display: initial;">&nbsp&nbsp&nbsp&nbsp${pname}</div></th>
                    <th>${ptitle}</th>
                    <th style="max-width: 200px;">${pcontent}</th>
                    <th>${type}类型<br><img style="max-height: 100px" src="${imgurl}" content="no-referrer" alt=""></th>
                    <th>${ptime}</th>
                    <td>
                        <button data-id="${id}" class="delid mdui-btn mdui-ripple mdui-color-indigo" type="button">删除</button>
                    </td>
                </tr>
    
    
    `

}

function imgerr(id,type) {
    t=$("#imgbar-"+id)
    console.log(id+"号"+type+"类型");
    if (type == "withimg") {
        t.attr("src",'https://i.imgtg.com/2022/10/15/Jy3Jb.png')
        mdui.snackbar({
            message: id+"号"+'图片404',
            position: 'top',
            timeout:"500"
        });
    } else if (type == "noimg"){
        t.remove()
        
    }
    return t
}
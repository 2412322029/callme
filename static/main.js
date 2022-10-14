basurl = "http://" + location.host
page = 1
limit = 5
var m = mdui.$;
var inst = new mdui.Dialog('#dialog');
var draw = new mdui.Drawer('#drawer');
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
        copy_data = $(this).attr("copy-data")
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
                                , data[i]["title"], data[i]["data"], data[i]["imgurl"], data[i]["id"])
                            $("#comment-block").append(str)
                        } else {
                            str = loopcard(data[i]["name"], data[i]["avatar"], getTime(data[i]["time"])
                                , data[i]["title"], data[i]["data"], data[i]["imgurl"], data[i]["id"])
                            $("#comment-block").append(str)
                        }

                    }
                    mdui.snackbar({
                        message: count + "条数据加载成功,return: " + msg,
                        position: 'top'
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
function delmsg(n) {
    $.ajax({
        url: basurl + "/api/delmsg",
        data: { "n": n },
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




function loopcard(pname, avatar, ptime, ptitle, pcontent, imgurl, id) {
    return `
        <div id=card-"${id}" class="mdui-card mdui-hoverable mdui-center" style="margin: 30px ;width:800px;max-height:2000px ;border-radius: 16px">
                <div class="mdui-card-header">
                    <img class="mdui-card-header-avatar" src="${avatar}" content="no-referrer">
                    <div class="mdui-card-header-title">${pname}</div>
                    <div class="mdui-card-header-subtitle">${ptime}</div>
                </div>
                        <div class="mdui-card-media">
                            
                            <img style="max-height: 800px" src="${imgurl}" content="no-referrer">
                            
                        </div>
                <div class="mdui-card-primary">
                    <div class="mdui-card-primary-title">${ptitle}</div>
                </div>
                <div class="mdui-card-content">${pcontent}</div>
                <div class="mdui-card-actions">

                    <div id="like-${id}" class="mdui-float-right mdui-card-primary-subtitle">0</div>
                    <button class="mdui-btn mdui-btn-icon mdui-float-right" >
                        <i class="mdui-icon material-icons">favorite</i>
                    </button>
                    
                    <div id="comment-${id}" class="mdui-float-right mdui-card-primary-subtitle">0</div>
                    <a target="_blank"  href="/card/${id}" class="mdui-btn mdui-btn-icon mdui-float-right">
                        <i class="mdui-icon material-icons">comment</i>
                    </a>

                    <button class="copy mdui-btn mdui-btn-icon mdui-float-right" copy-data="${basurl}/card/${id}">
                        <i class="mdui-icon material-icons">share</i>
                    </button>


                </div>
            </div>`
}

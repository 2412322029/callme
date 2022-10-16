basurl = "http://" + location.host//api地址
imgbar_err = "https://i.imgtg.com/2022/10/15/Jy3Jb.png"//附加图片404替换图片
avatar_err = "https://i.imgtg.com/2022/10/15/J7QcN.png"//头像404替换图片
limit = 10//每页显示的个数
headline_name = "Demo"//标题
//--------------------
page = 1
var m = mdui.$;
var inst = new mdui.Dialog('#dialog');
var draw = new mdui.Drawer('#drawer');
var tooltip = new mdui.Tooltip(".tooltip");
$("#headline").text(headline_name)
getcount()
loadnew(1, limit)
function getTime(timestamp) {
    var date = new Date(parseInt(timestamp) * 1000);
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
}
function copytocpil() {
    $('.copy').on('click', function () {//不要（）=>this指向
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
function scrolltocard(id) {//"auto","instant"或"smooth"
    if ($("#card-" + id).length == 1) {
        $("#card-" + id)[0].scrollIntoView({ behavior: "auto", block: "center" })
    } else {
    }
}
$('#dialog-close').on('click', () => {
    inst.close();
});
$('#email').on('click', () => {
    $("#dialog-title").text("Hello")
    $("#dialog-content").text("2412322029@qq.com")
    inst.open();
});
$('#drawer-option').on('click', () => {
    draw.toggle();
});
$("#refresh").on('click', () => {
    $("#card-block").html(``)
    loadnew(1, limit)
});

$('#more').on('click', () => {
    loadnew(page * limit, page * limit + limit)
    page++
    getcount()

});
$('#creat').on('click', () => {
    $("#card-block").fadeOut(200)
    $("#needhide").fadeOut(200)
    $("#history").fadeOut(200)
    $("#aboutme").fadeOut(200)

    $("#input-block").fadeIn()
});
function tohome() {
    $("#card-block").fadeIn()
    $("#needhide").fadeIn(200)
    $("#history").fadeIn()

    $("#input-block").fadeOut(200)
    $("#aboutme").fadeOut(200)
}
$('#tohome').on('click', () => {
    tohome()
});


$('#about').on('click', () => {
    $("#card-block").fadeOut(200)
    $("#needhide").fadeOut(200)
    $("#history").fadeOut(200)
    $("#input-block").fadeOut(200)

    $("#aboutme").fadeIn()
});
$("#sub").click(() => {
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
    // console.log(pdata);
    $.ajax({
        url: basurl + "/api/addmsg",
        data: { "name": pname, "avatar": avatar, "title": title, "data": pdata, "imgurl": imgurl, "type": ptype },
        type: "post",
        error: () => {
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
                str = loopcard(pname, avatar, "刚刚", title + "(刚刚)", pdata, imgurl, "", ptype, 0)
                $("#card-block").prepend(str)

                // loadnew(1, 1)
                copytocpil()

            } else {
                mdui.snackbar({
                    message: "发送失败：" + msg,
                    position: 'top'
                });
            }

        }

    });
    setTimeout(() => {
        tohome()//回到主页
        window.scrollTo({//滚动到顶部
            top: 0,
            // behavior: "smooth"
        })
    }, 1000);

}
function getcount() {
    $.ajax({
        url: basurl + "/api/getcount",
        type: "get",
        error: () => {
            mdui.snackbar({
                message: "网络故障，计数获取失败",
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
        error: () => {
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
                setTimeout(() => {
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
                        // console.log(data[i]["comment_count"])
                        if (data[i]["avatar"] == "") {
                            str = loopcard(data[i]["name"], avatar_err, getTime(data[i]["time"])
                                , data[i]["title"], data[i]["data"], data[i]["imgurl"], data[i]["id"], data[i]["type"]
                                , data[i]["comment_count"]
                            )
                            $("#card-block").append(str)
                        } else {
                            str = loopcard(data[i]["name"], data[i]["avatar"], getTime(data[i]["time"])
                                , data[i]["title"], data[i]["data"], data[i]["imgurl"], data[i]["id"], data[i]["type"]
                                , data[i]["comment_count"]
                            )
                            $("#card-block").append(str)
                        }

                    }
                    mdui.snackbar({
                        message: count + "条数据加载成功,return: " + msg,
                        position: 'top',
                        timeout: "500"
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
        error: () => {
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
                setTimeout(() => {
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
    succ = 0
    $.ajax({
        url: basurl + "/api/delmsg",
        data: { "n": n, "DelPasswd": DelPasswd },
        type: "GET",
        async: false,
        error: () => {
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
                succ = 1

            } else {
                mdui.snackbar({
                    message: msg + ", code:" + code,
                    position: 'top'
                });
            }
        }
    });
    return succ
}




function loopcard(pname, avatar, ptime, ptitle, pcontent, imgurl, id, type, comment_count) {
    return `
        <div id="card-${id}" class="mdui-card mdui-hoverable mdui-center" style="margin-bottom: 50px;width:90%;max-height:2000px ;border-radius: 8px">
                <div class="mdui-card-header">
                <div class="mdui-card-header-subtitle mdui-float-right">id=${id}</div>
                    <img class="mdui-card-header-avatar" src="${avatar}" referrerPolicy="no-referrer" alt="" onerror="javascript:this.src='${avatar_err}'">
                    <div class="mdui-card-header-title">${pname}</div>
                    <div class="mdui-card-header-subtitle">${ptime}</div>
                </div>
                        <div class="mdui-card-media">
                            
                            <img style="max-height: 800px" src="${imgurl}" referrerPolicy="no-referrer" alt="" onerror="imgerr(${id},'${type}');" id="imgbar-${id}" >
                            
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
                    
                    <div id="comment-${id}" class="mdui-float-right mdui-card-primary-subtitle">${comment_count}</div>
                    <a target="_blank"  onclick="showdetail(${id})" class="mdui-btn mdui-btn-icon mdui-float-right tooltip" mdui-tooltip="{content: '评论', position: 'auto'}">
                        <i class="mdui-icon material-icons">comment</i>
                    </a>

                    <button type="button" class="copy mdui-btn mdui-btn-icon mdui-float-right tooltip" data-copy="${basurl}/?card=${id}" mdui-tooltip="{content: '点击复制分享链接', position: 'auto'}">
                        <i class="mdui-icon material-icons">share</i>
                    </button>


                </div>
            </div>`
}


function addtable(pname, avatar, ptime, ptitle, pcontent, imgurl, id, type) {
    return `
    <tr id="tr-${id}">
                    <th>${id}</th>
                    <th><img class="mdui-card-header-avatar" src="${avatar}" referrerPolicy="no-referrer" alt="" onerror="javascript:this.src='${avatar_err}'";>
                    <div style="margin-top: 10px;display: initial;">&nbsp&nbsp&nbsp&nbsp${pname}</div></th>
                    <th>${ptitle}</th>
                    <th style="max-width: 200px;">${pcontent}</th>
                    <th>${type}类型<br><img style="max-height: 100px" src="${imgurl}" referrerPolicy="no-referrer" alt=""></th>
                    <th>${ptime}</th>
                    <td>
                        <button class="delid mdui-btn mdui-ripple mdui-color-indigo" onclick="del_msg(${id})" type="button">删除</button>
                    </td>
                </tr>
    
    
    `

}

function imgerr(id, type) {
    t = $("#imgbar-" + id)
    // console.log(id + "号" + type + "类型");
    if (type == "withimg") {
        t.attr("src", imgbar_err)
        mdui.snackbar({
            message: id + "号" + '图片404',
            position: 'top',
            timeout: "500"
        });
    } else if (type == "noimg") {
        t.remove()

    }
    return t
}


function showmsgById(id) {

    $.ajax({
        url: basurl + "/api/showmsgById",
        data: { "id": id },
        type: "get",
        async: "true",
        error: () => {
            mdui.snackbar({
                message: "网络故障，查询失败",
                position: 'top'
            });

        },
        success: function (result) {
            code = result["code"]
            msg = result["msg"]
            if (code == 200) {
                type = result["data"][0]["type"]
                img = result["data"][0]["imgurl"]
                time = result["data"][0]["time"]
                content = result["data"][0]["data"]
                pname = result["data"][0]["name"]
                t = result["data"][0]["title"]
                id = result["data"][0]["id"]
                // console.log(result["data"][0], img, type, time, content, pname, t);

                avatar = result["data"][0]["avatar"]
                if (type == "withimg") {
                    $("#detail-img").attr("onerror", imgbar_err)
                    $("#detail-img").attr("src", img)
                } else {
                }
                $(".mdui-typo-headline").text(t)//设置文章标题
                $("#detail-title").text(t)
                $("#detail-time").text(getTime(time))
                $("#detail-content").html(content)
                $("#detail-avatar").attr("src", avatar)
                $("#detail-avatar").attr("onerror", `javascript:this.src='${avatar_err}';`)
                $("#detail-call").text(pname)

            } else {
                mdui.snackbar({
                    message: msg + ",code:" + code,
                    position: 'top'
                });
                $(".mdui-typo-headline").text("页面不存在")
                $("#detail").remove()
            }
        }

    });

}
// window.onscroll = () => {
//     var scrollPos;
//     if (typeof window.pageYOffset != 'undefined') {
//         scrollPos = window.pageYOffset;
//     }
//     else if (typeof document.body != 'undefined') {
//         scrollPos = document.body.scrollTop;
//     }
//     document.cookie = "scrollTop=" + scrollPos;
// }
window.onload = () => {
    // if (document.cookie.match(/scrollTop=([^;]+)(;|$)/) != null) {//保存滚动位置
    //     var arr = document.cookie.match(/scrollTop=([^;]+)(;|$)/);
    //     setTimeout(() => {
    //         window.scrollTo({
    //             top: arr[1],
    //             behavior: "smooth"
    //         })
    //         console.log(arr[1]);
    //     }, 500)


    // }
    id = GetQueryValue("card")
    if (id == null) {

    } else {
        showdetail(id)
        setTimeout(() => {
            window.scrollTo({//滚动到顶部
                top: 0,
                // behavior: "smooth"
            })
        }, 100);

    }


}




mem = "标题"
function showdetail(id) {
    // $("#detail-img").attr("src","")
    // 隐藏其他
    $("#card-block").hide(200)//card 

    $("#history").hide(200)//加载更多
    $("#aboutme").hide(200)//关于
    $("#needhide").hide(200)//刷新按钮
    $("#search").hide(200)//搜索

    //请求数据
    showmsgById(id)
    updateUrl(id)



    $("#input-block").hide(200)//创建card
    $("#detail").show(200)//进入
    $("#detail").attr("data-cid", id)
    $("#drawer-option>i").text('arrow_back')//菜单改为返回键
    mem = $(".mdui-typo-headline").text()//记住原来的标题
    $("#drawer-option").unbind();//取消绑定
    $('#drawer-option').on('click', () => {
        returntocard(id)
    });
    draw.close();
    //加载评论
    readcomment(id)

    window.scrollTo({//滚动到顶部
        top: 0,
        // behavior: "smooth"
    })



}
function returntocard(id) {
    $("#allcomment").html("")
    $("#detail-img").attr("src", "")
    $("#detail").hide(200)
    $("#card-block").show()//card 
    $("#search").show(200)//搜索
    $("#needhide").show(200)
    $("#history").show()

    $(".mdui-typo-headline").text(mem)//还原标题
    $("#drawer-option>i").text('menu')//还原
    setTimeout(() => {
        $('#drawer-option').on('click', () => {//重bind
            draw.toggle();
        });
    }, 1000);
    if (document.body.clientWidth > 800) {//宽屏幕打开侧边
        draw.open();
    }
    history.pushState('', '', window.location.href.split("/?")[0])
    scrolltocard(id)


}

function updateUrl(id) {
    var newurl = updateQueryStringParameter("card", id)
    window.history.replaceState({
        path: newurl
    }, '', newurl);
}

function updateQueryStringParameter(key, value) {
    var uri = window.location.href
    if (!value) {
        return uri;
    }
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

function GetQueryValue(queryName) {
    var query = decodeURI(window.location.search.substring(1));
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == queryName) { return pair[1]; }
    }
    return null;
}


function sentcomment(cid, depth, parent_id, name, content) {
    content = content.replace(/[\n\r]/g, '<br>')
    console.log(cid, "|", depth, "|", parent_id, "|", name, "|", content);
    $.ajax({
        url: basurl + "/api/sentcomment",
        data: {
            "cid": cid, "depth": depth, "parent_id": parent_id,
            "name": name, "content": content
        },
        type: "POST",
        async: "true",
        error: () => {
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
                if (depth == 0) {
                    str = showcomment(0, name, "刚刚", content)
                    $("#allcomment").prepend(str)
                    $("#c-0")[0].scrollIntoView({ behavior: "auto", block: "center" })
                    $("#c-0").animate({ opacity: '0' });
                    $("#c-0").animate({ opacity: '1' });
        
                } else if (depth == 1) {
                    str = showcomment(0, name, "刚刚", content)
                    $("#l-" + parent_id).after(str)
                    $("#c-0")[0].scrollIntoView({ behavior: "auto", block: "center" })
                    $("#c-0").animate({ opacity: '0' });
                    $("#c-0").animate({ opacity: '1' });
                }
                click_reply_btn()

                // location.reload()
            }
        }

    });
}

$("#submitbtn").on('click', () => {
    cid = $("#detail").attr("data-cid")
    // console.log(cid);
    depth = 0
    parent_id = 0
    commentSubmit(cid, depth, parent_id)
});
function commentSubmit(cid, depth, parent_id) {
    cname = $("#cname").val()
    content = $("#content").val()
    if (cname.length == 0 || content.length == 0) {
        mdui.snackbar({
            message: "内容不能为空",
            position: 'top'
        });
    } else if (cname.length > 30 || content.length > 1000) {
        mdui.snackbar({
            message: "文本太长",
            position: 'top'
        });
    } else {
        sentcomment(cid, depth, parent_id, cname, content)
    }
}
function readcomment(cid) {
    $.ajax({
        url: basurl + "/api/readcomment",
        data: { "cid": cid },
        type: "GET",
        async: "false",
        error: () => {
            mdui.snackbar({
                message: "网络故障，评论获取失败",
                position: 'top'
            });
        },
        success: function (result) {
            code = result["code"]
            msg = result["msg"]

            if (code == 200) {
                data = result["data"]
                for (i = 0; i < data.length; i++) {
                    id = data[i]["id"]
                    cid = data[i]["cid"]//
                    pname = data[i]["name"]
                    content = data[i]["content"]
                    time = data[i]["time"]
                    depth = data[i]["depth"]//
                    parent_id = data[i]["parent_id"]//
                    if (depth == 0) {
                        str = showcomment(id, pname, getTime(time), content)
                        $("#allcomment").prepend(str)
                    } else if (depth == 1) {
                        str = showreplycomment(id, pname, getTime(time), content)
                        $("#c-" + parent_id).append(str)
                    }

                }
                click_reply_btn()
            } else {
            }
        }
    });
}
function showcomment(id, cname, ctime, cdetail) {
    return `
    <div id="c-${id}" class="mdui-card-primary">
        <div class="on">
            <div class="mdui-card-primary-subtitle  id="detail-time">
                <span id="c-cname-${id}" style="font-size: 20px;">${cname}</span>
                &nbsp在<span id="c-ctime-${id}">${ctime}</span>发表的评论
            </div>
            <div id="c-cdetail-${id}" id="detail-call" class="mdui-list-item-content mdui-m-b-2">
                ${cdetail}
                <button data-partent="${id}" style="border-radius: 8px"
                    class="mdui-btn mdui-color-grey-700 mdui-ripple mdui-float-right replybtn">
                    <i class="mdui-icon material-icons">reply</i>回复 </button>
            </div>
        </div>

        <i class="mdui-icon material-icons" id="zdup-${id}" onclick="zdup(${id})" style="cursor: pointer;">
        keyboard_arrow_down</i>

        
            <div class="mdui-divider" id="l-${id}"></div>
        <div class="on-body"></div>
        
    </div>
    `
}
function showreplycomment(id, cname, ctime, cdetail) {
    return `
    <div id="c-${id}" class="mdui-card-primary" style="margin-left:40px;padding-right: 0;">
        <div class="on">
            <div style="border-left: #ffffff1f solid;padding-left: 20px;">
                <div class="mdui-card-primary-subtitle" id="detail-time">
                    <span id="c-cname-${id}" style="font-size: 20px;">${cname}</span>
                    &nbsp在<span id="c-ctime-${id}">${ctime}</span>发表的评论
                </div>
                <div id="c-cdetail-${id}" id="detail-call" class="mdui-list-item-content mdui-m-b-2 " >
                    ${cdetail}
                    <button data-partent="${id}" style="border-radius: 8px"
                        class="mdui-btn mdui-color-grey-700 mdui-ripple mdui-float-right replybtn">
                        <i class="mdui-icon material-icons">reply</i>回复 </button>
                </div>
            </div>
        </div>
        <i class="mdui-icon material-icons" id="zdup-${id}" onclick="zdup(${id})" style="cursor: pointer;">
        keyboard_arrow_down</i>

        
            <div class="mdui-divider" id="l-${id}"></div>
        <div class="on-body"></div>

    </div>
    `
}
flag = 0
function changetheme() {
    if (flag == 1) {
        $("body").removeClass("mdui-theme-layout-dark").addClass("mdui-theme-primary-blue")
        flag = 0
    } else if (flag == 0) {
        $("body").removeClass("mdui-theme-primary-blue").addClass("mdui-theme-layout-dark")
        flag = 1
    }

}
function click_reply_btn() {
    $(".replybtn").on('click', function () {
        parent_id = $(this).attr("data-partent")
        console.log(parent_id);
        $(".replybox").remove()
        $("#l-" + parent_id).after(dom)
        $("#sentreply").on('click', function () {
            rname = $("#reply_name").val()
            content = $("#reply_content").val()
            cid = $("#detail").attr("data-cid")
            depth = 1
            if (rname.length == 0 || content.length == 0) {
                mdui.snackbar({
                    message: "内容不能为空",
                    position: 'top'
                });
            } else if (rname.length > 30 || content.length > 1000) {
                mdui.snackbar({
                    message: "文本太长",
                    position: 'top'
                });
            } else {
                console.log(cid, "|", depth, "|", parent_id, "|", rname, "|", content);
                sentcomment(cid, depth, parent_id, rname, content)
            }
        });
    });


    dom = `<div class="replybox" style="border-left: #ffffff1f solid">
                <div class="mdui-card-primary">
                    <div class="mdui-card-primary-title">
                    回复
                        <button onclick="$('.replybox').remove()" style="border-radius: 8px" type="button"
                            class="mdui-btn mdui-color-red mdui-ripple mdui-float-right">
                            关闭 </button>
                    </div>
                </div>
                <div class="mdui-card-content">
                    <div class="mdui-textfield">
                        <label class="mdui-textfield-label">name</label>
                        <input id="reply_name" class="mdui-textfield-input" type="text">
                    </div>
                    <div class="mdui-textfield">
                        <label class="mdui-textfield-label">内容</label>
                        <textarea id="reply_content" class="mdui-textfield-input" rows="4"></textarea>
                    </div>
                </div>
                <div class="mdui-card-actions">
                
                    <button id="sentreply" style="border-radius: 8px" type="button"
                        class="mdui-btn mdui-color-indigo mdui-ripple mdui-float-right">
                        发送 </button>
                </div>
        </div>`
}

function zdup(id){
    if($("#zdup-"+id).css('transform')=='matrix(-1, -1.22465e-16, 1.22465e-16, -1, 0, 0)'){
        $("#zdup-"+id).css({'transform': 'rotate(0deg)'});
    }else{
        $("#zdup-"+id).css({'transform': 'rotate(-180deg)'});
    }
    
    x=$("#c-"+id+">.on-body")
    x.nextAll().slideToggle("slow");
}

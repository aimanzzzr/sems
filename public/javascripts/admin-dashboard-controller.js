import {generalController} from './general-controller.js';

const currentPath = generalController.getCurrentPath();
let tablerow = null;

//General js event listener for all admin page
$(document).ready(()=>{
    $('.close').on('click',()=>{
        $('.alert').alert('close');
    });
});

if(currentPath == '/a/Dashboard/users'){
    //Url:/a/Dashboard/users
    $(document).ready(()=>{
        generalController.serviceSender('fetchUsers',{
            admin_document  : document.querySelector('meta[name="admin_document"]').getAttribute('content'),
            user_document   : null,
            request         : "fetch"
        }).then((res)=>{
            if(res.status_code == 200){
                document.getElementById('user_document').value = res.data._id;
                document.getElementById('fullname').value = res.data.fullname;
                document.getElementById('username').value = res.data.username;
                document.getElementById('old_username').value = res.data.username;
                document.getElementById('password').placeholder = "Password Has Already Been Set";
                document.getElementById('birthdate').value = res.data.birth_date;
                document.getElementById('title_before').value = res.data.countdown_title.before;
                document.getElementById('title_on').value = res.data.countdown_title.on;
                document.getElementById('is_firework').checked = res.data.is_firework;
                document.getElementById('is_password').checked = res.data.has_password;
                document.getElementById('link').value = window.location.hostname+"/u/"+res.data.username;
            }
        });

        //Show and display password - usually field empty
        $('#display_password').on('click',()=>{
            let password = document.getElementById('password');
            if(password.type === 'text'){
                password.type = 'password';
                $('#display_password_icon').removeClass('fa-eye-slash');
                $('#display_password_icon').addClass('fa-eye');
            }else if(password.type === 'password'){
                password.type = 'text';
                $('#display_password_icon').removeClass('fa-eye');
                $('#display_password_icon').addClass('fa-eye-slash');
            }
        });

        //Generate shareable link to be used
        $('#username').keyup(()=>{
            document.getElementById('link').value = window.location.hostname+"/u/"+document.getElementById('username').value;
        });

        //Update user data fetcher
        $('#user-form').on('submit',(e)=>{
            e.preventDefault();
            let error           = false;
            let data = {
                admin_document  : document.querySelector('meta[name="admin_document"]').getAttribute('content'),
                user_document   : document.getElementById('user_document').value == '' ? null : document.getElementById('user_document').value,
                fullname        : document.getElementById('fullname').value,
                username        : document.getElementById('username').value,
                old_username    : document.getElementById('old_username').value,
                password        : document.getElementById('password').value,
                birthdate       : document.getElementById('birthdate').value,
                title_before    : document.getElementById('title_before').value,
                title_on        : document.getElementById('title_on').value,
                is_firework     : document.getElementById('is_firework').checked,
                is_password     : document.getElementById('is_password').checked,
                request         : "fetch",
                update_request  : "users_info"
            };

            if(generalController.ValidateParams(data.fullname)){
                document.getElementById('fullname_error').innerText = "Invalid Fullname!";
                error = true;
            }
            if(generalController.ValidateParams(data.username)){
                document.getElementById('username_error').innerText = "Invalid Username!"
                error = true;
            };
            if(generalController.ValidateParams(data.birthdate)){
                document.getElementById('birthdate_error').innerText = "Invalid Date";
                error = true;
            }
            if(error == false){
                generalController.serviceSender('processUsers',data).then((res)=>{
                    generalController.generateAlert({status_code : res.status_code, data_type : "User info" , request : "update"});
                });
            }
        });
    });
}

function massageDailyMessageRow(table,params){
    generalController.generateTableRow({
        table           : table,
        rows            : [
            params.message_header,
            params.is_active == true ? 'Active' : 'Inactive',
            params.is_weekend == null ? 'All Days' : params.is_weekend == true ? 'Weekend' : 'Weekdays',
            params.time_interval == null ? 'All Time' : generalController.getTimeInterval(params.time_interval - 1),
            params.user_id == null ? 'All Users' : params.user_id.username,
            generalController.generateActionButtons(params._id)
        ]
    });
}

if(currentPath == "/a/Dashboard/daily-message"){
    //Url:/a/Dashboard/daily-message
    $(document).ready(()=>{
        let table = generalController.initDatatables({table_name:'daily-message-table'});
        //Append users list into modal
        generalController.serviceSender('fetchUsers',{
            admin_document  : document.querySelector('meta[name="admin_document"]').getAttribute('content'),
            request         : "fetch"
        }).then((res)=>{
            if(res.status_code == 200){
                let option = `<option value="${res.data._id}" selected>${res.data.username}</option>`;
                $('#daily_message_users').append(option);
            }
        });
        //Fetch when load page
        generalController.serviceSender('fetchDailyMessage',{
            admin_document      : document.querySelector('meta[name="admin_document"]').getAttribute('content'),
            user_document       : null
        }).then((res)=>{
            if(res.status_code == 200){
                res.data.forEach(e => {
                    e.request = "generate";
                    massageDailyMessageRow(table,e);
                });
            }
        });
        //Open Modal In Create
        $('#add_dailymessage').on('click',()=>{
            let modal = $('#daily_message');
            modal.find('#daily_message_label')[0].innerText     = "Add Daily Message";
            modal.find('#daily_message_submit')[0].innerText    = "Add Daily Message";
            modal.find('#daily_message_method')[0].value        = "add";
            modal.modal('toggle');
        });
        //Submit Modal Content
        $('#daily_message_modal').on('submit',(e)=>{
            e.preventDefault();
            let error           = false;
            let modalContent    = $('#daily_message');
            let data = {
                message_header      : modalContent.find('#daily_message')[0].value,
                document_document   : modalContent.find('#daily_message_document')[0].value == "" ? null : modalContent.find('#daily_message_document')[0].value,
                is_weekend          : modalContent.find('#daily_message_display_days')[0].value,
                time_interval       : modalContent.find('#daily_message_time_interval')[0].value,
                user_document       : modalContent.find('#daily_message_users')[0].value == "" ? null : modalContent.find('#daily_message_users')[0].value,
                admin_document      : document.querySelector('meta[name="admin_document"]').getAttribute('content'),
                method              : modalContent.find('#daily_message_method')[0].value
            };

            if(generalController.ValidateParams(data.message_header)){
                modalContent.find('#daily_message_error')[0].innerText = "Invalid Message!";
                error = true;
            }

            if(error == false){
                generalController.serviceSender('processDailyMessage',data).then((res)=>{
                    modalContent.modal('hide');
                    if(res.status_code == 200){
                        res.data.message_header = data.message_header;
                        generalController.deleteTableRow({table:table,row:tablerow});
                        massageDailyMessageRow(table,res.data);
                        generalController.generateAlert({status_code : res.status_code, data_type : "Daily Message", request : data.method});
                }   
                modalContent.find('#daily_message')[0].value = "";
                });
            }
        });
        
        //Delete daily message
        $('#daily-message-table tbody').on( 'click', '#delete_daily_message_button',function (){
            let row = $(this);
            document.getElementById('delete_daily_message_id').value =  $(this).attr('data_id');
            $('#delete_modal').modal('toggle');

            $('#delete_daily_message_modal').on('submit',(e)=>{
                e.preventDefault();
                generalController.serviceSender('deleteDailyMessage',{
                    admin_document      : document.querySelector('meta[name="admin_document"]').getAttribute('content'),
                    document_document   : document.getElementById('delete_daily_message_id').value
                }).then((res)=>{
                    $('#delete_modal').modal('toggle');
                    if(tablerow == null){
                        location.reload();
                    }else{
                        generalController.deleteTableRow({table:table,row:row});
                    }
                });
            })
        });
        //Edit daily message
        //improvement -> update table row when edit modal
        $('#daily-message-table tbody').on( 'click', '#edit_daily_message_button',function (){
            tablerow = $(this);
            document.getElementById('daily_message_document').value = $(this)[0].getAttribute('data_id');

            generalController.serviceSender('fetchDailyMessage',{
                admin_document      : document.querySelector('meta[name="admin_document"]').getAttribute('content'),
                user_document       : null, 
                document_document   : $(this)[0].getAttribute('data_id')
            }).then((res)=>{
                let modal = $('#daily_message');
                modal.find('#daily_message_label')[0].innerText     = "Edit Daily Message";
                modal.find('#daily_message_submit')[0].innerText    = "Edit Daily Message";
                modal.find('#daily_message_method')[0].value        = "update";
                modal.find('#daily_message')[0].value               = res.data[0].message_header;
                modal.modal('toggle');
            });
        });
    });
}
if(currentPath == '/a/Dashboard/visited-logs'){
    //Url: /a/Dashboard/visited-logs
    $(document).ready(()=>{
        //Fetch log data
        generalController.serviceSender('fetchLogs',{admin_document  : document.querySelector('meta[name="admin_document"]').getAttribute('content')}).then((res)=>{
            if(res.status_code == 200){
                let table = generalController.initDatatables({table_name:'logs-table'});
                res.data.forEach((e)=>{
                    let created_at = new Date(e.created_at);
                    generalController.generateTableRow({
                        table       : table,
                        rows        : [
                            e.os_info,
                            e.browser_info,
                            e.device_info,
                            `${created_at.toLocaleDateString()} ${created_at.getHours() < 10 ? '0' + created_at.getHours() : created_at.getHours()}:${created_at.getMinutes() < 10 ? '0' + created_at.getMinutes() : created_at.getMinutes()} ${created_at.getHours() >= 12 ? 'PM' : 'AM'}`,
                            e.user_id.username,
                            e.counter
                        ]
                    });
                })
            }
        });
    });
}


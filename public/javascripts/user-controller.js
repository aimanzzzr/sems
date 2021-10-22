import {generalController} from './general-controller.js';
let page = document.querySelector('meta[name="page"]').getAttribute('content');

function DailyMessage(current_hour,current_day){
    generalController.serviceSender('fetchDailyMessage',{admin_document : document.querySelector('meta[name="admin_document"]').getAttribute('content'),user_document : document.querySelector('meta[name="user_document"]').getAttribute('content')}).then((res)=>{
        if(res.status_code == 200 && res.data[0] != null){
            console.log(res);
            let timeDayInterval = generalController.getTimeDayInterval(current_hour,current_day);
            let message_header = new Array();
            res.data.forEach(e =>{
                if((e.time_interval == timeDayInterval.time_interval || e.time_interval == null) && (e.is_weekend == timeDayInterval.is_weekend || e.is_weekend == null)) message_header.push(e.message_header);
            });
            document.getElementById('daily-message').innerHTML = message_header[generalController.getRandomNumber(message_header.length)];
        }
    });
}

if(page == "verification"){
    function showPassword(){
        let password = document.getElementById('password');
        let checkbox = document.getElementById('displayPassword');

        if(checkbox.checked){
            password.type = "text";
        }else{
            password.type = "password";
        }
    }
}

if(page == "countdown"){
    generalController.serviceSender('fetchUsers',{
        admin_document      : document.querySelector('meta[name="admin_document"]').getAttribute('content'),
        username            : document.querySelector('meta[name="username"]').getAttribute('content'),
        user_document       : document.querySelector('meta[name="user_document"]').getAttribute('content'),
        request             : "fetch"
    }).then((res)=>{
        if(res.status_code == 200){
            let data = res.data;
            let birth_date  = String(data.birth_date);
            let birth_day   = parseInt(birth_date.substr(8,2),10);
            let birth_month = parseInt(birth_date.substr(5,2),10);
            let check_date  = generalController.checkYear(birth_day,birth_month,birth_day + 10,birth_month);

            const second    = 1000;
            const minutes   = second * 60;
            const hour      = minutes * 60;
            const day       = hour * 24;

            let countdown   = check_date.min_date.getTime();
            let process     = setInterval(()=>{
                let now         = new Date().getTime();
                let distance    = countdown - now;
                document.getElementById('days').innerText = Math.floor(distance / (day));
                document.getElementById('hours').innerText = Math.floor((distance % (day)) / (hour));
                document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minutes));
                document.getElementById('seconds').innerText = Math.floor((distance % (minutes)) / second);

                if(Math.floor(distance / (day)) > 0){
                    document.title = data.countdown_title.before;
                    document.getElementById('header').innerText = data.username + "'S BIRTHDAY IN";
                }else{
                    document.title = data.countdown_title.on;
                    document.getElementById('header').innerText = data.username + " BIRTHDAY";
                }
            },second);

            let current_time = new Date();
            DailyMessage(current_time.getHours(),current_time.getDay());
            if(check_date.status == true){
                document.getElementById('container').style.visibility = 'hidden';
            }
            $('.animation-gif').removeClass('d-none');
            $('.text').removeClass('d-none');
        }
    });
}
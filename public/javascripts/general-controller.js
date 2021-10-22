let generalController = {
    getCurrentPath          : ()=>{
        return window.location.pathname;
    },
    isJson                  : (string)=>{
        try {
            JSON.parse(str);
        }catch(e){
            return false;
        }
        return true;
    },
    serviceSender           : async (url,data)=>{
        let token = document.querySelector('meta[name="token_id"]').getAttribute('content');
        const response = await fetch("/api/" + url,{
            method : 'POST',
            credentials : 'same-origin',
            headers : {
                'CSRF-TOKEN': token,
                'Content-Type': 'application/json'
            },
            cache : 'no-cache',
            body : JSON.stringify(data)
        });
        try {
            JSON.parse(response);
        }catch(e){
            return response.json();
        }
        return response;
    },
    generateAlert           : (response)=>{
        let data = {class : "",words : ""};

        if(response.status_code == 200){
            data.class = "success";
            data.words = `${response.data_type} has been ${response.request} successfully!`;
        }else{
            data.class = "danger";
            data.words = `Failed to ${response.request} ${response.data_type}`;
        }
        let alert = `<div class="alert alert-${data.class} alert-dismissible fade show" role="alert">${data.words}<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`;
        $('#alert-container').append($.parseHTML(alert));
    },
    getTimeInterval         : (data)=>{
        let time_interval = [
            'Morning - 05.00 am until 12.00 pm',
            'Lunch Break - 12.00 pm until 2.00 pm',
            'Afternoon - 02.00 pm until 04.00 pm',
            'Afternoon Break - 04.00 pm until 04.30 pm',
            'Evening - 04.30 pm until 08.00 pm',
            'Night - 08.00 pm until 12.00 am',
            'Late Night - 12.00 am until 05.00 pm'
        ];
        return time_interval[data];
    },
    initDatatables          : (config)=>{
        let table = $(`#${config.table_name}`).DataTable({
            pageLength  : (typeof config.page_length === undefined || config.page_length == null) ? 4 : config.page_length,
            lengthMenu  : (typeof config.length_menu === undefined || config.length_menu == null) ? [[4, 8, 12, -1], [4, 8, 12, 'All']] : config.length_menu 
        });
        return table;
    },
    generateTableRow        : (data)=>{
        data.table.row.add(data.rows).draw();
    },
    deleteTableRow          : (data)=>{
        data.table.row(data.row.parents('tr')).remove().draw();
    },
    updateTableRow          : (data)=>{
        data.table.row(data.row[0]).data(data.rows).draw();
    },
    generateActionButtons   : (id)=>{
        let buttons = `<center><div class="action-buttons"><input type="hidden" id="document_document_id" value="${id}">
                       <button class="btn btn-md btn-primary" id="edit_daily_message_button" data_id="${id}"><i class="fas fa-pen"></i></button></li>&nbsp;&nbsp;
                       <button class="btn btn-md btn-danger" id="delete_daily_message_button" data_id="${id}"><i class="fas fa-trash-alt"></i></button></li>
                       </div></center>`;
        return buttons;
    },
    ValidateParams          : (params)=>{
        if(typeof params === undefined || params === null || params === ""){
            return true;
        }
        return false;
    },
    getRandomNumber         : (max_length)=>{
        return Math.floor(Math.random() * Math.floor(max_length));
    },
    getTimeDayInterval      : (current_hour,current_day)=>{
        let time_interval = 0;
        let is_weekend = false;
        let current_minutes = new Date().getMinutes();

        if(current_hour >= 5 && current_hour < 12){
            time_interval = 1;
        }else if(current_hour >= 12 && current_hour < 14){
            time_interval = 2;
        }else if(current_hour >= 14 && current_hour < 16){
            time_interval = 3;
        }else if(current_hour == 16 && current_minutes < 30){
            time_interval = 4;
        }else if((current_hour >= 16 && current_minutes >= 30) && current_hour < 20){
            time_interval = 5;
        }else if(current_hour >= 20 && current_hour < 24){
            time_interval = 6;
        }else{
            time_interval = 7;
        }

        if(current_day == 6 || current_day == 0){
            is_weekend = true;
        }

        return {time_interval : time_interval,is_weekend : is_weekend};
    },
    checkYear               : (min_day,min_month,max_day,max_month)=>{
        let current_date = new Date();
        let current_year = current_date.getFullYear();
        let new_min_date = new Date(current_year,min_month - 1,min_day);
        let new_max_date = new Date(current_year,max_month - 1,max_day);
        let status       = null;

        if(current_date > new_max_date){
            new_min_date = new Date(current_year + 1,min_month - 1,min_day);
            new_max_date = new Date(current_year + 1,max_month - 1,max_day);
            status       = false;
        }else if(current_date < new_min_date){
            status       = false;
        }else if(current_date >= new_min_date && current_date <= new_max_date){
            status       = true;
        }else{
            console.log(`this function is triggered`);
            window.location = '/error';
        }
        return {min_date:new_min_date,max_date:new_max_date,status:status};
    }
}

export {generalController};
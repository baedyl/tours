$(document).ready(function(){
  $("#country").change(function(){
    $.ajax({
      type: 'GET',
      url: "http://localhost:5000/account/test/"+ $("#country").val() ,
      dataType: 'json'
    })
    .done(function(data){
    $('#city').contents().remove();
    $('#city').append($('<option>' , {value:"", text:"Veuillez choisir votre ville"}));
      data.forEach(city => {
            $('#city').append($('<option>', {
              value: city,
              text: city
              }));
           });
           $("#city").val($("#usercity").val());
    });
  });
});
    // $('select>option:eq(3)').prop('selected', true);
    // $('#select_link').click(function (e) {
    //   e.preventDefault();
    //   console.log('select_link clicked');
    //   var data = {};
    //   data.title = "title";
    //   data.message = "message";

    //   $.ajax({
    //     type: 'POST',
    //     data: JSON.stringify(data),
    //     contentType: 'application/json',
    //     url: 'http://localhost:3000/endpoint',
    //     success: function (data) {
    //       console.log('success');
    //       console.log(JSON.stringify(data));
    //     }
    //   });

    // });
  
  

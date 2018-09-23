// $(function () {
//   $("#country").change(function () {
//     var new_cities = require('full-countries-cities').getCities($("#country").val).sort();
//     res.locals.cities = new_cities;
//     if ($("#country").val != '') {
//       new_cities.forEach(city => {

//         $('#city').contents().remove();
//         var newOption = $('<option/>');
//         newOption.attr('value', city[j]);
//         $('#city').append(newOption);
//       });

//     }
//   });
// });
$(document).ready(function () {
  $('#country').on('change', function () {
    var countryID = $(this).val();
    if (countryID) {
      $.ajax({
        type: 'POST',
        url: 'account.js',
        data: 'country_id=' + countryID,
        success: function (html) {
          $('#city').html(html);
        }
      });
    } else {
      $('#city').html('<option value="">Select state first</option>');
    }
  })
});

$(document).ready(function(){

  $("#country").change(function(){
    $('#city').append($('<option>', {
    value: $("#country").val,
    text:$("#country").val
    }));
  });
});

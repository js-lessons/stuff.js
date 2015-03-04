$(function() {
  var clearFormat = function(price) {
    return parseFloat(price.replace(/[^0-9-.]/g, ''));
  },

  formatMoney = function(price) {
    return '$' + price;
  },

  calculateTotal = function() {
    var total = 0;

    $('input').each(function() {
      var $this = $(this);

      total += $this.data('price') * parseInt($this.val());
    });

    $('.total-amount').text(formatMoney(total));
  },

  calculateSubtotal = function(e) {
    var product = e.originalEvent.currentTarget,
        price = $('.price', product),
        subtotal = formatMoney($(this).data('price') * parseInt($(this).val()));

    price.html(subtotal);
  },

  savePrices = function() {
    $('.price').each(function() {
      $(this).next('input').data('price', clearFormat($(this).text()));
    });
  };

  $('.product').on('change', 'input', function(e) {
    calculateSubtotal.call(this, e);
    calculateTotal();
  });

  $('.product').on('click', '.delete', function(e) {
    e.preventDefault();
    $(e.originalEvent.currentTarget).remove();
    calculateTotal();
  });

  $('.checkout a').on('click', function(e) {
    e.preventDefault();

    $.ajax({
      dataType: 'json',
      data: JSON.stringify($('form').serializeArray()),
      type: 'post'
    })
    .success(function() {
      alert('Thank you for your order');
    });
  });

  savePrices();
});

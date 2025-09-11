
document.addEventListener('DOMContentLoaded', function () {
    /**
     * ========================================
     *  HELPERS
     * ========================================
     */

    /**
     * Wrap an element in a new wrapper div.
     * @param {HTMLElement} el - Element to wrap.
     * @param {string} className - CSS class to add to wrapper.
     */
    function wrapElement(el, className) {
        if (!el || !el.parentNode) return;
        var wrapper = document.createElement('div');
        wrapper.className = className;
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    }

    /**
     * Update the URL parameter without reloading the page.
     * @param {string} key 
     * @param {string} value 
     */
    function updateUrlParameter(key, value) {
        var url = new URL(window.location.href);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    }

    /**
     * Toggle credit card & PayPal options depending on donation interval.
     * @param {string} interval - Value of "interval" URL param.
     */
    function updateCreditcardSwitchDisplay(interval) {
        var toggleDivs = document.querySelectorAll('.creditcard-switch, .paymentmethod[for="paypal"]');
        toggleDivs.forEach(function (div) {
            if (interval !== '0') {
                div.style.display = 'none';
                console.log('disable creditcard switch buttons', div);
            } else {
                div.setAttribute('style', ''); // reset inline style
                console.log('enable creditcard switch buttons', div);
            }
        });
    }

    /**
     * Insert an info text below "Zahlungsweise" legend during a given date range.
     * @param {string} start - Start date YYYY-MM-DD
     * @param {string} end - End date YYYY-MM-DD
     * @param {string} text - Text to display
     */
    function insertInfoTextBetweenDates(start, end, text) {
        var startDate = new Date(start);
        var endDate = new Date(end);
        var currentDate = new Date();
        var legendElement = document.querySelector('#paymentMethodBox > Legend');
        if (!legendElement) return;

        var p = document.createElement('p');
        if (currentDate >= startDate && currentDate <= endDate) {
            p.textContent = text;
            p.className = 'text-enabled';
        } else {
            p.textContent = '';
            p.className = 'text-disabled';
        }
        legendElement.appendChild(p);
    }

    /**
     * ========================================
     *  FORM CUSTOMIZATION
     * ========================================
     */

    // Move first donation custom field (country select) into .text-muted section
    var firstCustomField = document.querySelector('#donationCustomFields div.form-group:first-child');
    if (firstCustomField) {
        firstCustomField.classList.add('country-select');
        firstCustomField.parentNode.removeChild(firstCustomField);
        var donorDataMuted = document.querySelector('#donorData .text-muted');
        if (donorDataMuted) donorDataMuted.prepend(firstCustomField);
    }

    // Preselect custom country field with "AT"
    var customCountrySelect = document.getElementById('payment_donation_custom_field_8542');
    if (customCountrySelect) {
        customCountrySelect.value = 'AT';
    }

    // Insert info text below legend if within date range
    insertInfoTextBetweenDates('2024-12-23', '2024-12-31', 'Infotextbox ist aktiv');

    // Add span.icon to all choice labels
    document.querySelectorAll('.choice label, .radio label, .well label')
        .forEach(function (label) {
            var span = document.createElement('span');
            span.className = 'icon';
            span.setAttribute('aria-hidden', 'true');
            label.appendChild(span);
        });

    // Add placeholder to "Betrag" field
    var customAmountInput = document.getElementById('payment_amount');
    if (customAmountInput) {
        customAmountInput.placeholder = 'Eigener Betrag';
    }

    // Wrap all select boxes in .select-wrapper divs
    document.querySelectorAll('select').forEach(function (select) {
        wrapElement(select, 'select-wrapper');
    });

    // Add <span class="checkmark"> to checkbox labels
    document.querySelectorAll('.checkbox .control-label').forEach(function (label) {
        var span = document.createElement('span');
        span.className = 'checkmark';
        label.appendChild(span);
    });

    // Setup birthday input
    var paymentBirthdayInput = document.getElementById('payment_birthday');
    if (paymentBirthdayInput) {
        paymentBirthdayInput.placeholder = 'TT.MM.JJJJ';
        paymentBirthdayInput.readOnly = false;
    }

    // Add .creditcard-switch class to last paymentmethod div
    var paymentMethodsDiv = document.querySelector('#paymentmethods .paymentmethod:last-child');
    if (paymentMethodsDiv) {
        paymentMethodsDiv.classList.add('creditcard-switch');
    }

    // Handle credit card switch display on page load
    var urlParams = new URLSearchParams(window.location.search);
    var interval = urlParams.get('interval');
    if (interval !== null) {
        updateCreditcardSwitchDisplay(interval);
    }

    // Handle interval select change
    var intervalSelectBox = document.querySelector('.input-interval select');
    if (intervalSelectBox) {
        intervalSelectBox.addEventListener('change', function (event) {
            var selectedValue = event.target.value;
            updateCreditcardSwitchDisplay(selectedValue);
            updateUrlParameter('interval', selectedValue);
        });
    }

    // Hide the standard country selection field
    var defaultCountryField = document.querySelector('#address > .input-country');
    if (defaultCountryField) {
        defaultCountryField.classList.add('country-select-hidden');
        defaultCountryField.style.display = 'none';
    }

    // Move newsletter field into #additionalSettings
    var newsletterField = document.querySelector('#donationCustomFields .form-group:first-child');
    if (newsletterField) {
        newsletterField.classList.add('newsletter');
        newsletterField.parentNode.removeChild(newsletterField);
        var additionalSettingsDiv = document.querySelector('#additionalSettings');
        if (additionalSettingsDiv) {
            additionalSettingsDiv.insertBefore(newsletterField, additionalSettingsDiv.firstChild);
        }
    }

    // Hide the default newsletter checkbox, sync with custom radio buttons
    var newsletterCheckbox = document.querySelector('#additionalSettings .input-wants_newsletter');
    if (newsletterCheckbox) {
        newsletterCheckbox.classList.add('newsletter-checkbox');
        newsletterCheckbox.style.display = 'none';
        document.querySelectorAll('input[name="payment[donation_custom_field_8543]"]')
            .forEach(function (radio) {
                radio.addEventListener('change', function () {
                    var wantsNewsletterCheckbox = document.getElementById('payment_wants_newsletter');
                    if (wantsNewsletterCheckbox) {
                        wantsNewsletterCheckbox.checked = (this.value === 'Ja');
                    }
                });
            });
    }

    // Move custom country field into #address and sync with default select
    var donationCountryField = document.querySelector('#donationCustomFields div.form-group.input-donation_custom_field_8542');
    if (donationCountryField) {
        donationCountryField.classList.add('country-select');
        donationCountryField.parentNode.removeChild(donationCountryField);

        var addressDiv = document.querySelector('#address');
        if (addressDiv) addressDiv.appendChild(donationCountryField);

        var select1 = document.getElementById('payment_donation_custom_field_8542');
        var select2 = document.getElementById('payment_country');

        if (select1 && select2) {
            select1.addEventListener('change', function () {
                select2.value = select1.value;
            });
            // Default to AT
            select1.value = 'AT';
            select2.value = 'AT';
        }
    }
});

/**
 * ========================================
 *  OUTSIDE DOMContentLoaded: 
 *  Company toggle hides/shows birthday field
 * ========================================
 */
var companyCheckbox = document.getElementById('payment_company_is_donor');
var birthdayInput = document.getElementById('payment_birthday');
var userBirthdayValue = '';
if (companyCheckbox && birthdayInput) {
    var birthdayParent = birthdayInput.parentNode;
    companyCheckbox.addEventListener('change', function () {
        if (companyCheckbox.checked) {
            // Store value, hide field
            userBirthdayValue = birthdayInput.value;
            birthdayParent.removeChild(birthdayInput);
            document.querySelector('.input-birthday').style.display = 'none';
        } else {
            // Show field again and restore value
            document.querySelector('.input-birthday').style.display = '';
            birthdayParent.appendChild(birthdayInput);
            birthdayInput.value = userBirthdayValue || '';
        }
    });
}

/* validator-fixed.js
   - Use this instead of the previous script.
   - Behavior:
     * validate only fields inside the form (on blur / focusout)
     * if a blacklisted substring is found: remove the input, focus the SAME field again,
       and display an inline German error message right after that field only.
     * error clears as soon as the user types something that no longer contains the blacklist.
*/

(function () {
  'use strict';

  const config = {
    formSelector: '#fbPaymentForm', // your form selector
    blacklist: ['https://'],        // substring, case-insensitive
    fieldSelectors: [
      '#payment_first_name',
      '#payment_last_name'
    ],
    invalidBorderStyle: '2px solid #d9534f',
    // German message — direct and clear
    errorMessage: 'Ungültige Eingabe: Keine Links (z. B. "https://...") in diesem Feld erlaubt. Bitte geben Sie hier keinen Link ein.'
  };

  // helper: case-insensitive substring check
  function containsBlacklisted(value) {
    if (!value) return false;
    const v = String(value).toLowerCase();
    return config.blacklist.some(term => v.includes(String(term).toLowerCase()));
  }

  // gather fields that are INSIDE the form (avoid matching unrelated fields)
  function getValidatedFields(form) {
    const list = [];
    config.fieldSelectors.forEach(sel => {
      form.querySelectorAll(sel).forEach(el => list.push(el));
    });
    return Array.from(new Set(list));
  }

  // create the inline error element
  function createErrorElement(message) {
    const msg = document.createElement('div');
    msg.className = 'validator-error';
    msg.style.color = '#d9534f';
    msg.style.fontSize = '0.9em';
    msg.style.marginTop = '4px';
    msg.textContent = message;
    return msg;
  }

  // mark a single element invalid — only affects that element
  function markInvalid(el) {
    if (!el) return;

    // save inline border to restore later
    if (el.dataset._validator_prev_border === undefined) {
      el.dataset._validator_prev_border = el.style.border || '';
    }
    el.style.border = config.invalidBorderStyle;
    el.setAttribute('aria-invalid', 'true');

    // remove any existing error that belongs to THIS element only
    if (el._validatorErrorElement) {
      el._validatorErrorElement.remove();
      el._validatorErrorElement = null;
    }

    // insert new error immediately AFTER the field
    const msgEl = createErrorElement(config.errorMessage);
    if (el.nextSibling) el.parentNode.insertBefore(msgEl, el.nextSibling);
    else el.parentNode.appendChild(msgEl);
    el._validatorErrorElement = msgEl;

    // clear the user's input and re-focus the same field
    el.value = '';
    setTimeout(() => {
      try { el.focus(); } catch (err) { /* ignore */ }
    }, 0);
  }

  // clear invalid state for a single element
  function clearInvalid(el) {
    if (!el) return;
    if (el.dataset._validator_prev_border !== undefined) {
      el.style.border = el.dataset._validator_prev_border;
      delete el.dataset._validator_prev_border;
    } else {
      el.style.border = '';
    }
    el.removeAttribute('aria-invalid');

    if (el._validatorErrorElement) {
      el._validatorErrorElement.remove();
      el._validatorErrorElement = null;
    }
  }

  // DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector(config.formSelector);
    if (!form) {
      console.warn('Validator: form not found for selector', config.formSelector);
      return;
    }

    const fields = getValidatedFields(form);
    if (fields.length === 0) {
      console.warn('Validator: no fields matched selectors (inside the form).', config.fieldSelectors);
    }

    // quick membership check
    const validatedSet = new Set(fields);

    // validate only the element that just lost focus
    // use focusout because blur does not bubble
    form.addEventListener('focusout', (e) => {
      const el = e.target;
      if (!validatedSet.has(el)) return;

      // if the (trimmed) value contains a blacklisted term => mark invalid
      if (containsBlacklisted(el.value.trim())) {
        markInvalid(el);
      }
      // otherwise do nothing
    });

    // on input: clear the error for that element as soon as it no longer contains blacklist
    form.addEventListener('input', (e) => {
      const el = e.target;
      if (!validatedSet.has(el)) return;
      if (!containsBlacklisted(el.value)) {
        clearInvalid(el);
      }
    });

    // prevent submit if any fields are still invalid
    form.addEventListener('submit', (e) => {
      let hasInvalid = false;
      fields.forEach(f => {
        if (containsBlacklisted(f.value.trim())) {
          markInvalid(f);
          hasInvalid = true;
        }
      });
      if (hasInvalid) e.preventDefault();
    });
  });
})();

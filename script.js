
const ownerWhatsApp = "917225918295";

// Date field elements
const eventDateInput = document.getElementById("eventDate");
const hiddenDatePicker = document.getElementById("hiddenDatePicker");
const datePickerButton = document.getElementById("datePickerButton");

// Set today's date as minimum booking date
function setMinimumDate() {
  if (!hiddenDatePicker) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  hiddenDatePicker.min = `${year}-${month}-${day}`;
}

setMinimumDate();


// DATE FIELD: Only allow DD-MM-YYYY format
eventDateInput.addEventListener("input", function () {
  let digits = this.value.replace(/\D/g, "").slice(0, 8);

  if (digits.length > 4) {
    digits = digits.slice(0, 2) + "-" + digits.slice(2, 4) + "-" + digits.slice(4);
  } else if (digits.length > 2) {
    digits = digits.slice(0, 2) + "-" + digits.slice(2);
  }

  this.value = digits;
});


// Open calendar when calendar button is clicked
datePickerButton.addEventListener("click", function () {
  if (hiddenDatePicker.showPicker) {
    hiddenDatePicker.showPicker();
  } else {
    hiddenDatePicker.click();
  }
});


// When a date is selected from calendar
hiddenDatePicker.addEventListener("change", function () {
  if (!this.value) return;

  const [year, month, day] = this.value.split("-");

  eventDateInput.value = `${day}-${month}-${year}`;
});


// BOOK ITEM BUTTON
function bookItem(itemName) {
  const checkboxes = document.querySelectorAll(
    'input[name="selection"]'
  );

  const matchingCheckbox = Array.from(checkboxes).find(
    checkbox => checkbox.value === itemName
  );

  if (matchingCheckbox) {
    matchingCheckbox.checked = true;
  }

  document.getElementById("booking").scrollIntoView({
    behavior: "smooth"
  });
}


// BOOKING FORM SUBMIT
document.getElementById("bookingForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Get all selected singers and instruments
    const selectedItems = Array.from(
      document.querySelectorAll(
        'input[name="selection"]:checked'
      )
    ).map(checkbox => checkbox.value);

    const eventType = document.getElementById("eventType").value;
    const eventDate = eventDateInput.value.trim();
    const location = document.getElementById("location").value.trim();
    const message = document.getElementById("message").value.trim();


    // Check that at least one option is selected
    if (selectedItems.length === 0) {
      alert("Please select at least one Singer or Instrument.");
      return;
    }


    // Check that date has been entered
    if (!eventDate) {
      alert("Please select or enter your event date.");
      eventDateInput.focus();
      return;
    }


    // Validate DD-MM-YYYY format
    const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
    const dateMatch = eventDate.match(datePattern);

    if (!dateMatch) {
      alert("Please enter the date in DD-MM-YYYY format, for example 29-10-2026.");
      eventDateInput.focus();
      return;
    }

    const day = Number(dateMatch[1]);
    const month = Number(dateMatch[2]);
    const year = Number(dateMatch[3]);

    // Check if calendar date is valid
    const selectedDateObject = new Date(year, month - 1, day);

    if (
      selectedDateObject.getFullYear() !== year ||
      selectedDateObject.getMonth() !== month - 1 ||
      selectedDateObject.getDate() !== day
    ) {
      alert("Please enter a valid calendar date.");
      eventDateInput.focus();
      return;
    }


    // Check date is today or future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDateObject.setHours(0, 0, 0, 0);

    if (selectedDateObject < today) {
      alert("Please select today or a future date.");
      eventDateInput.focus();
      return;
    }


    // Detect singer and instrument selections
    const hasSinger = selectedItems.some(
      item => item.toLowerCase().includes("singer")
    );

    const hasInstrument = selectedItems.some(
      item => !item.toLowerCase().includes("singer")
    );


    // Determine booking type
    let bookingType = "";

    if (hasSinger && hasInstrument) {
      bookingType = "Singer & Instruments";
    } else if (hasSinger) {
      bookingType = "Singer";
    } else {
      bookingType = "Instruments";
    }


    // Convert date to YYYY-MM-DD for WhatsApp message
    const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


    // Create WhatsApp booking message
    const whatsappMessage =
      "STAR MUSICAL EVENTS - NEW BOOKING ENQUIRY\n\n" +
      "Customer Name: " + name + "\n" +
      "Mobile Number: " + phone + "\n" +
      "Booking Type: " + bookingType + "\n\n" +
      "Selected Singer / Instruments:\n" +
      selectedItems.map(item => "- " + item).join("\n") +
      "\n\n" +
      "Event Type: " + eventType + "\n" +
      "Event Date: " + formattedDate + "\n" +
      "Event Location: " + location + "\n" +
      "Additional Details: " + message;


    // Open WhatsApp with booking details
    const whatsappURL =
      "https://wa.me/" + ownerWhatsApp +
      "?text=" + encodeURIComponent(whatsappMessage);

    window.open(whatsappURL, "_blank");
  }
);

import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvc, setCVC] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showForm, setShowForm] = useState(true);
  // errors
  const [blankErrors, setBlankErrors] = useState({
    name: "",
    cardNumber: "",
    month: "",
    year: "",
    cvc: "",
  });
  const [numberErrors, setNumberErrors] = useState({
    cardNumber: "",
    month: "",
    year: "",
    cvc: "",
  });
  const [nameError, setNameError] = useState("");
  const [yearError, setYearError] = useState("");

  /* handlers */
  const handleBlankError = (field, value) => {
    setBlankErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value === "" ? "Can't be blank" : "",
    }));
  };
  const handleNumberError = (field, value) => {
    setNumberErrors((prevErrors) => ({
      ...prevErrors,
      [field]: /[^0-9\s]/.test(value) ? "Wrong format, numbers only" : "",
    }));
  };
  const handleNameChange = (e) => {
    const originalValue = e.target.value;
    if (/[^a-zA-Z\s]/.test(originalValue)) {
      setNameError("wrong format, a-z characters only");
    } else {
      setNameError("");
    }
    setInputValue(originalValue);
    setName(originalValue.toUpperCase());
    handleBlankError("name", originalValue);
  };
  const formatCardNumber = (value) => {
    const cleanedValue = value.replace(/\s+/g, "");
    return cleanedValue.replace(/(.{4})/g, "$1 ").trim();
  };
  const handleYearError = (value) => {
    const currentYear = new Date().getFullYear();
    const formattedCurrentYear = currentYear % 100;
    if (!value) {
      setYearError("");
    } else if (Number(value) < formattedCurrentYear) {
      setYearError("invalid year");
    } else {
      setYearError("");
    }
    setYear(value);
  };
  function handleSubmit(e) {
    e.preventDefault();
    let hasError = false;
    const fields = { name, cardNumber, month, year, cvc };

    Object.keys(fields).forEach((field) => {
      if (!fields[field]) {
        handleBlankError(field, "");
        hasError = true;
      }
    });
    if (
      numberErrors.cardNumber ||
      numberErrors.month ||
      numberErrors.year ||
      numberErrors.cvc ||
      nameError ||
      yearError
    ) {
      hasError = true;
    }
    if (hasError) {
      return;
    }

    setShowForm(false);
  }

  function handleReset() {
    setShowForm(true);
    setName("");
    setCardNumber("");
    setMonth("");
    setYear("");
    setCVC("");
    setInputValue("");
  }

  return (
    <div className="container">
      <Card>
        <CardFront>
          <Circles />
          <CardDetails
            name={name}
            cardNumber={cardNumber}
            month={month}
            year={year}
          />
        </CardFront>
        <CardBack cvc={cvc} />
      </Card>
      {showForm ? (
        <Form handleSubmit={handleSubmit}>
          <NameInput
            blankErrors={blankErrors}
            nameError={nameError}
            inputValue={inputValue}
            handleNameChange={handleNameChange}
          />
          <CardNumberInput
            blankErrors={blankErrors}
            numberErrors={numberErrors}
            cardNumber={cardNumber}
            formatCardNumber={formatCardNumber}
            setCardNumber={setCardNumber}
            handleBlankError={handleBlankError}
            handleNumberError={handleNumberError}
          />
          <div className="date-cvc">
            <DateInput
              blankErrors={blankErrors}
              numberErrors={numberErrors}
              month={month}
              setMonth={setMonth}
              handleBlankError={handleBlankError}
              handleNumberError={handleNumberError}
              yearError={yearError}
              handleYearError={handleYearError}
            />
            <CVCInput
              blankErrors={blankErrors}
              numberErrors={numberErrors}
              cvc={cvc}
              setCVC={setCVC}
              handleBlankError={handleBlankError}
              handleNumberError={handleNumberError}
            />
          </div>
        </Form>
      ) : (
        <CompletedState handleReset={handleReset} />
      )}
    </div>
  );
}

function Card({ children }) {
  return <div className="card">{children}</div>;
}
function CardFront({ children }) {
  return (
    <div className="card-front">
      <img src="/images/bg-card-front.png" alt="card front" />
      {children}
    </div>
  );
}
function Circles() {
  return (
    <div className="circles">
      <div className="white-circle"></div>
      <div className="transparent-circle"></div>
    </div>
  );
}
function CardDetails({ name, cardNumber, month, year }) {
  return (
    <div className="card-details">
      <div class="card-number">
        {cardNumber ? cardNumber : <p>0000 0000 0000 0000</p>}
      </div>
      <div className="row">
        <p class="card-name">{name ? name : "JANE APPLESEED"}</p>
        <p class="card-expiry">
          {month ? month : "00"}/{year ? year : "00"}
        </p>
      </div>
    </div>
  );
}
function CardBack({ cvc }) {
  return (
    <div className="card-back">
      <img src="/images/bg-card-back.png" alt="card back" />
      <div className="CVC">
        <p>{cvc ? cvc : "000"}</p>
      </div>
    </div>
  );
}
function Form({ children, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-info">
        {children}
        <Button>Confirm</Button>
      </div>
    </form>
  );
}
function NameInput({ blankErrors, nameError, inputValue, handleNameChange }) {
  return (
    <div className="name">
      <label>CARDHOLDER NAME</label>
      <input
        className={blankErrors.name || nameError ? "error" : ""}
        type="text"
        placeholder="e.g. Jane Appleseed"
        value={inputValue}
        onChange={handleNameChange}
      />
      {blankErrors.name && (
        <span className="error-message">{blankErrors.name}</span>
      )}
      {nameError && <span className="error-message">{nameError}</span>}
    </div>
  );
}
function CardNumberInput({
  blankErrors,
  numberErrors,
  cardNumber,
  formatCardNumber,
  setCardNumber,
  handleBlankError,
  handleNumberError,
}) {
  return (
    <div className="card-num">
      <label>CARD NUMBER</label>
      <input
        className={
          blankErrors.cardNumber || numberErrors.cardNumber ? "error" : ""
        }
        type="text"
        placeholder="e.g. 1234 5678 9123 0000"
        value={cardNumber}
        onChange={(e) => {
          const value = e.target.value;
          const formattedValue = formatCardNumber(value);
          setCardNumber(value.length <= 19 ? formattedValue : cardNumber);
          handleBlankError("cardNumber", value);
          handleNumberError("cardNumber", value);
        }}
      />
      {blankErrors.cardNumber && (
        <span className="error-message">{blankErrors.cardNumber}</span>
      )}
      {numberErrors.cardNumber && (
        <span className="error-message">{numberErrors.cardNumber}</span>
      )}
    </div>
  );
}
function DateInput({
  blankErrors,
  numberErrors,
  month,
  setMonth,
  year,
  handleBlankError,
  handleNumberError,
  yearError,
  handleYearError,
}) {
  return (
    <div className="date">
      <label>EXP. DATE (MM/YY)</label>
      <span>
        <div className="wrapper">
          <input
            className={blankErrors.month || numberErrors.month ? "error" : ""}
            type="text"
            placeholder="MM"
            value={month}
            onChange={(e) => {
              const value = e.target.value;
              setMonth(value);
              handleBlankError("month", value);
              handleNumberError("month", value);
            }}
          />
          {blankErrors.month && (
            <span className="error-message">{blankErrors.month}</span>
          )}
          {numberErrors.month && (
            <span className="error-message">{numberErrors.month}</span>
          )}
        </div>
        <div className="wrapper">
          <input
            className={
              blankErrors.year || numberErrors.year || yearError ? "error" : ""
            }
            type="text"
            placeholder="YY"
            value={year}
            onChange={(e) => {
              const value = e.target.value;
              handleYearError(value);
              handleBlankError("year", value);
              handleNumberError("year", value);
            }}
          />
          {blankErrors.year && (
            <span className="error-message">{blankErrors.year}</span>
          )}
          {numberErrors.year && (
            <span className="error-message">{numberErrors.year}</span>
          )}
          {yearError && <span className="error-message">{yearError}</span>}
        </div>
      </span>
    </div>
  );
}

function CVCInput({
  blankErrors,
  numberErrors,
  cvc,
  setCVC,
  handleBlankError,
  handleNumberError,
}) {
  return (
    <div className="cvc">
      <label>CVC</label>
      <input
        className={blankErrors.cvc || numberErrors.cvc ? "error" : ""}
        type="text"
        placeholder="e.g. 123"
        value={cvc}
        onChange={(e) => {
          const value = e.target.value;
          setCVC(value);
          handleBlankError("cvc", value);
          handleNumberError("cvc", value);
        }}
      />
      {blankErrors.cvc && (
        <span className="error-message">{blankErrors.cvc}</span>
      )}
      {numberErrors.cvc && (
        <span className="error-message">{numberErrors.cvc}</span>
      )}
    </div>
  );
}
function CompletedState({ handleReset }) {
  return (
    <div className="completed-state">
      <div className="icon-complete">
        <img src="/images/icon-complete.svg" alt="icon-complete" />
      </div>
      <h1>THANK YOU!</h1>
      <p>We've added your card details</p>
      <Button handleReset={handleReset}>Continue</Button>
    </div>
  );
}
function Button({ children, handleReset }) {
  return (
    <button type="submit" className="btn" onClick={handleReset}>
      {children}
    </button>
  );
}
export default App;

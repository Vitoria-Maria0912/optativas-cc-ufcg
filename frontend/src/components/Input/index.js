import "./style.css"

const InputItem = ({ inputType, placeholder, icon, data, setData }) => (
    <div className="input-item">
        <div className="icon-wrapper">
            {icon}
        </div>
        <input
            type={inputType}
            value={data}
            placeholder={placeholder}
            onChange={(e) => setData(e.target.value)}
        />
    </div>
);

const Input = ({ label, inputType, placeholder, icon, data, setData, duplicatedPass=true }) => {
    const shouldRenderTwoInputs = (duplicatedPass && inputType === "password");

    let first, second, setFirst, setSecond;
    if (Array.isArray(data)) {
        [first, second] = data
    }

    if (Array.isArray(setData)) {
        [setFirst, setSecond] = setData
    }

    return (
        <div className="input-group">
            <label>{label}:</label>
            {shouldRenderTwoInputs ? (
                <>
                    <InputItem {...{ inputType, placeholder, icon, data: first, setData: setFirst }} />
                    <InputItem {...{ inputType, placeholder, icon, data: second, setData: setSecond }} />
                </>
            ) : (
                <InputItem {...{ inputType, placeholder, icon, data, setData }} />
            )}
        </div>
    );
};

export default Input;

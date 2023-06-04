import { MouseEvent } from 'react';
import ValidationErrors from '../../components/ValidationErrors';
import { IRegisterData } from '../../dto/identity/IRegisterData';
import { HandleChangeEventAction } from '../../utils/Utils';

interface IProps {
    values: IRegisterData;

    validationErrors: string[];

    handleChange: HandleChangeEventAction;

    onSubmit: (event: MouseEvent) => void;
}

const RegisterFormView = (props: IProps) => {
    return (
        <form>
            <h2>Create a new account.</h2>
            <hr />

            <ValidationErrors errors={props.validationErrors} />

            <div className="form-floating mb-3">
                <input
                    onChange={props.handleChange}
                    value={props.values.username}
                    className="form-control"
                    autoComplete="username"
                    aria-required="true"
                    placeholder="username"
                    type="text"
                    id="Input_Username"
                    name="username"
                />
                <label htmlFor="Input_Username">Username</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    onChange={props.handleChange}
                    value={props.values.password}
                    className="form-control"
                    autoComplete="new-password"
                    aria-required="true"
                    placeholder="password"
                    type="password"
                    id="Input_Password"
                    maxLength={100}
                    name="password"
                />
                <label htmlFor="Input_Password">Password</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    onChange={props.handleChange}
                    value={props.values.confirmPassword}
                    className="form-control"
                    autoComplete="new-password"
                    aria-required="true"
                    placeholder="password"
                    type="password"
                    id="Input_ConfirmPassword"
                    name="confirmPassword"
                />
                <label htmlFor="Input_ConfirmPassword">Confirm Password</label>
            </div>

            <button
                onClick={(e) => props.onSubmit(e)}
                id="registerSubmit"
                className="w-100 btn btn-lg btn-primary"
            >
                Register
            </button>
        </form>
    );
};

export default RegisterFormView;

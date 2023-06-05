import { FormEvent, MouseEvent } from 'react';
import './login.css';
import PendingApproval from '../../components/PendingApproval';
import ValidationErrors from '../../components/ValidationErrors';
import { ILoginData } from '../../dto/identity/ILoginData';
import { HandleChangeEventAction } from '../../utils/Utils';

interface IProps {
    values: ILoginData;

    validationErrors: string[];

    pendingApproval: boolean;

    handleChange: HandleChangeEventAction;

    onSubmit: (event: MouseEvent | FormEvent) => void;
}

const LoginFormView = (props: IProps) => {
    return (
        <form className="form-signin w-100 m-auto" onSubmit={props.onSubmit}>
            <h2>Login</h2>
            <hr />

            <PendingApproval pendingApproval={props.pendingApproval} />
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

            <button
                onClick={(e) => props.onSubmit(e)}
                id="registerSubmit"
                className="w-100 btn btn-lg btn-primary"
            >
                Login
            </button>
        </form>
    );
};

export default LoginFormView;

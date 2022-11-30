import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useInitialState } from '@/providers/InitialStateProvider';
import { Storage } from '@/constants';
import { fetchUserInfo, login } from '@/services';

type LoginFormDataType = {
  username: string;
  password: string;
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: Location };
  const from = state?.from?.pathname || '/';

  const { initialState, setInitialState } = useInitialState();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData);

    if (values.username === undefined || values.password === undefined) return;

    const { token } = await login(values as LoginFormDataType);
    localStorage.setItem(Storage.Token, token);

    const user = await fetchUserInfo();
    setInitialState?.((s) => ({ ...s, token, user }));

    setTimeout(() => navigate(from, { replace: true }));
  };

  if (initialState?.token && state?.from == null) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-item">
          <input name="username" placeholder="username" />
        </div>

        <div className="form-item">
          <input name="password" type="password" placeholder="password" />
        </div>

        <div className="form-item">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
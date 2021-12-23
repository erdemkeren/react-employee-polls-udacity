import Login from "./";
import { render, screen, fireEvent } from '../../../utils/test-utils';
import * as hooks from '../../../app/hooks';

describe('Login form', function () {
    it('should render', function () {
        const { container } = render(<Login />);

        expect(container).toMatchSnapshot();
    });

    it('should trigger login', function () {
        const useAppDispatch = jest.spyOn(hooks, 'useAppDispatch')
        const useAppSelector = jest.spyOn(hooks, 'useAppSelector')

        useAppSelector.mockReturnValue({
            isAuthenticated: false,
            userId: undefined,
            status: 'idle',
        });

        const dummyDispatch = jest.fn();
        useAppDispatch.mockReturnValue(dummyDispatch);

        render(<Login />);

        const button = screen.getByRole('button', /Sign In/i)
        fireEvent.click(button);
        expect(dummyDispatch).toBeCalledTimes(1);

        useAppDispatch.mockRestore();
        useAppSelector.mockRestore();
    });

    it('should disable the login button', function () {
        render(<Login />);

        const button = screen.getByRole('button', /Sign In/i)
        fireEvent.click(button);
        expect(button).toBeDisabled();
    });

    it('should show failed login info', function () {
        const useAppDispatch = jest.spyOn(hooks, 'useAppDispatch')
        const useAppSelector = jest.spyOn(hooks, 'useAppSelector')

        useAppSelector.mockReturnValue({
            isAuthenticated: false,
            userId: undefined,
            status: 'idle',
        });

        useAppSelector.mockReturnValue({
            status: 'failed',
        })

        const { container } = render(<Login />);

        expect(container).toHaveTextContent('The authentication was not successful.');

        expect(container).toMatchSnapshot();

        useAppDispatch.mockRestore();
        useAppSelector.mockRestore();
    });
});

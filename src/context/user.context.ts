import React from 'react';
import {UserModel} from '../models/user/user.model';

type UserContextType = {
    user?: UserModel;
    token?: string;
    isLoggedIn: boolean;
}

const initialValue: UserContextType = {isLoggedIn: false};
const UserContext = React.createContext(initialValue);
export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;

export default UserContext;

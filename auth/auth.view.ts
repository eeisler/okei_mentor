namespace $.$$ {

    type User = {
        id: number,
        username: string,
        first_name: string,
        middle_name: string,
        last_name: string,
        group: string
    }

    type UserLogin = {
        success: boolean,
        token: string,
        user: User
        username: string,
        password: string
    }

    export class $okei_mentor_auth extends $.$okei_mentor_auth {
        @ $mol_mem
        login_text(next?: string){
            if( next !== undefined ) {
                return next
            }
            return ''
        }

        @ $mol_mem
        pass_text(next?: string){
            if( next !== undefined ) {
                return next
            }
            return ''
        }

        @ $mol_action
        async draft_send( event?: Event){
            const login = this.login_text().trim()
            const pass = this.pass_text().trim()
            if( !login || !pass ) return

            const data = $mol_fetch.json('http://localhost:8000/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: login,
                    password: pass
                })
            }) as UserLogin;

            if (data.success){

                localStorage.setItem('auth_token', data.token)
                localStorage.setItem('user', data.user.username)

                this.login_text('')
                this.pass_text('')

                this.$.$mol_state_arg.value("", "chat")
            }
            window.location.reload()
        }
    }
}

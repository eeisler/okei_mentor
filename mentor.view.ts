namespace $.$${
    export class $okei_mentor extends $.$okei_mentor{
        @ $mol_mem
        is_authenticated() {
            const token = localStorage.getItem('auth_token')
            
            if (!token) {
                return false 
            }
            
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                const expired = payload.exp * 1000 < Date.now()
                
                if (expired) {
                    localStorage.removeItem('auth_token')
                    return false
                }
                
                return true
            } catch {
                return false
            }
        }

        @ $mol_mem
        spreads() {
            if (!this.is_authenticated()){
                return {
                    "login": this.Login(),
                    "signup": this.Signup(),
                }
            }
            return {
                    "chat": this.Chat(),
                    "progress": this.Progress(),
                }
        }

        @ $mol_action
        draft_logout(event?: Event){
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
            window.location.reload()
        }

        @ $mol_mem
        menu_tools(): readonly ( any )[] {
            if (!this.is_authenticated()){
                return [
                    this.Lights()
                ]
            }
            return [
                    this.Lights(),
                    this.LogoutButton()
            ]
        }
    }
}
namespace $.$${

    type User = {
        id: number,
        username: string,
        first_name: string,
        middle_name: string,
        last_name: string,
        group_id: number
    }

    type UserRegister = {
        username: string,
        password: string,
        first_name: string,
        last_name: string,
        middle_name: string,
        group_id: number
    }

    type Group =  {
        id: number,
        name: string
    }

    export class $okei_mentor_reg extends $.$okei_mentor_reg{

        @ $mol_mem
        groups(): Group[] {
            const data = $mol_fetch.json('http://localhost:8000/groups', {
                headers: {'Content-Type': 'application/json'}}) as Group[];
            console.log(data)
            return data
        }

        @ $mol_mem
        group_filter(next?: string){
            if(next !== undefined) return next
            return ''
        }

        @ $mol_mem
        selected_group(next?: Group | null){
            if(next !== undefined) return next
            return null
        }

        @ $mol_mem
        filtered_groups(){
            const all = this.groups()
            const filter = this.group_filter().toLowerCase()
            if (!filter) return all
            return all.filter(g => g.name.toLowerCase().includes(filter))
        }

        @ $mol_mem
        group_options(): string[]{
            const filtered = this.filtered_groups()
            return filtered.map(opt => opt.name)
        } 

        // not used
        @ $mol_action
        select_group(group: Group){
            this.selected_group(group)
            this.group_filter(group.name)
        }
        // not used
        @ $mol_action
        clear_group() {
            this.selected_group(null)
            this.group_filter('')
        }

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
        draft_send( event?: Event ){
            const login = this.login_text().trim()
            const pass = this.pass_text().trim()
            const group = this.filtered_groups()[0]

            if (!login || !pass || !group) {
                console.error('Please fill all fields')
                console.log(login, pass, group.id)
                return
            }

            const requestBody = {
                username: login,
                password: pass,
                first_name: "test",
                last_name: "test",
                middle_name: "test",
                group_id: group.id
            }
            
            console.log('Sending:', requestBody)
                const data = this.$.$mol_fetch.json('http://localhost:8000/register', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(requestBody) 
                }) as { success: true, user_id: number, username: string } | { success: false, error: string }
            
                if (data.success) {
                    console.log('Registration successful!')
                    this.login_text('')
                    this.pass_text('')
                    this.clear_group()
                    this.$.$mol_state_arg.value("", "login")
                } else {
                    this.$.$mol_fail( new Error( data.error ))
                }

            } 
        }
    }
    
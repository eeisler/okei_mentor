namespace $.$${
    type Progress =  {
            skill: string,
            level: number
        }

    export class $okei_mentor_progress extends $.$okei_mentor_progress{

        @ $mol_mem
        data(): Progress[] {
            const token = localStorage.getItem('auth_token')

            if (!token) {
                console.log('No token found')
                return []
            }
            const data = $mol_fetch.json('http://localhost:8000/progress', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }}) as Progress[];
            console.log(data)
            return data
        }

        @ $mol_mem
        rows() {
            const data = this.data()
            console.log(data)
            return $mol_range2(
                id => this.Row(id), 
                () => data.length
            )
        }

        @ $mol_mem_key
        skill_name(id: number): string {
            return this.data()[id]?.skill ?? ""
        }

        @ $mol_mem_key
        level_portion(id: number): number {
            return (this.data()[id]?.level ?? 0) / 100
        }
    }
}
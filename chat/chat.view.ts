namespace $.$$ {
    type ChatHistoryMessage = {
        id: string,
        role: string,
        content: string,
        timestamp: string, // todo: cast to datetime 
    }

    type ChatHistory = {
        user_id: number,
        messages: ChatHistoryMessage[],
    }

    type Message = {
        id: string,
        text: string,
        time: string,
        me: boolean,
    }

    export class $okei_mentor_chat extends $.$okei_mentor_chat {
        
        @ $mol_mem
        draft_text( next?: string ) {
            if( next !== undefined ) {
                return next
            }
            return ''
        }
    
        @ $mol_mem
        load_history(): Message[] {
            console.log('LOAD_HISTORY CALLED!');
            const data = $mol_fetch.json('http://localhost:8000/chat/history') as ChatHistory;

            console.log(data.messages);
            if (data.messages) {
                const history = data.messages.map((msg: ChatHistoryMessage, index: number) => ({
                    id: msg.id, 
                    text: msg.content,
                    time: new Date(msg.timestamp).toLocaleDateString(),
                    me: msg.role === 'user'
                })).sort((a, b) => {
                        const numA = parseInt(a.id) 
                        const numB = parseInt(b.id) 
                        return numA - numB  
                    })
                return history
            }
            return []
        }

        @ $mol_mem
        messages( next?: any[] ) {
            if( next !== undefined ) {
                return next
            }

            return this.load_history()
        }
        
        @ $mol_action
        draft_send( event?: Event ) {
            const text = this.draft_text().trim()
            if( !text ) return
            
            const user_msg = {
                id: String(Date.now()),
                text: text,
                time: new Date().toLocaleTimeString(),
                me: true
            }
            
            this.messages( [ ...this.messages(), user_msg ] )

            new this.$.$mol_after_frame(() => {
                    Array.from(
                        document.querySelectorAll("[okei_mentor_message_bubble_user]")
                    ).at(-1)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                })
            })
            
            new this.$.$mol_after_frame(() => {
                this.draft_text( '' )
            })
            
            const data = $mol_fetch.json('http://localhost:8000/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message:text })
            }) as { message: string }

            this.messages([...this.messages(), {
                id: Date.now() + 1,
                text: data.message,
                me: false
            }])

        }
        
        @ $mol_mem
        bubbles() {
            console.log(this.messages())
            return this.messages().map(msg => msg.me ? this.Bubble_user(msg.id) : this.Bubble_bot(msg.id))
        }

        @ $mol_mem
        bubble_text( id: any ): string {
            const messages = this.messages()  
            const msg = messages.find( (m: Message) => m.id === id )
            if( !msg ) return ""
            return msg.text
        }
    }
}

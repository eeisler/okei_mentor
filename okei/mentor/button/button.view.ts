namespace $.$$ {
	export class $okei_mentor_button extends $.$okei_mentor_button {
		sub(): readonly ($mol_view_content)[] {
			if (this.icon()) {
				return [this.icon(), this.title()];
			}
			return [this.title()]
		}
	}
}
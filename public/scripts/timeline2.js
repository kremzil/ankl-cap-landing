document.addEventListener('alpine:init', () => {
    Alpine.data('timeline', () => ({
        items: [
            { year: '2012', text: 'Začiatok cesty – prvé retail projekty a experimenty.' },
            { year: '2013', text: 'Rozširujeme portfólio služieb a posilňujeme tím.' },
            { year: '2014', text: 'Začíname s retailovou tlačou a meníme výklady po celom Slovensku.' },
            { year: '2018', text: 'Budujeme vlastné marketingové štúdio a rozširujeme služby o digitálny marketing.' },
            { year: '2022', text: 'Spúšťame projekty pre zahraničných klientov a otvárame prvé partnerstvá v EÚ.' }
        ],
        activeIndex: 0,
        
        get activeYear() {
            return this.items[this.activeIndex]?.year || '';
        },

        styles: {
            dot: {
                active: 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.85)] scale-125 opacity-100',
                inactive: 'bg-gray-600 shadow-none opacity-50 scale-100'
            },
            text: {
                active: 'text-gray-200 opacity-100 translate-x-0',
                inactive: 'text-gray-500 opacity-60 translate-x-4'
            }
        }
    }));
});
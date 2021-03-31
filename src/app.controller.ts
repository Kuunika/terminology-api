import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    welcomeMessage(){
        return 'Welcome to the Terminology Service';
    }
}

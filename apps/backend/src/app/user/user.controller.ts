import { Body, Controller, Get, Param, UseGuards, UsePipes, ValidationPipe, Post, Req, Res } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { SearchResourceDto } from "../models/dto/searchResource";
import { Token } from "../models/common/token";
import { AccessService } from "../access/access.service";
import * as fs from 'fs';
import type { Request, Response } from "express";
import { RequestService } from "../request/request.service";

@Controller('user')
export class UserController{

    constructor(
        private readonly accessService:AccessService,
        private readonly requestService:RequestService
    ){}

    @Get('visualize/:id')
    @UseGuards(JwtGuard)
    @UsePipes(ValidationPipe)
    async getResourceImages(@Req() req : Request & { user: Token },@Res() res:Response ,@Param('id') id: number){
        const path = await this.accessService.getResourcesAsImages(id,req.user);
        //first step: compute the range
        const stat = fs.statSync(path);
        const range = req.headers['range']!;
        //check if range is set. if not, send all the file, i don't care
        if(!range){
            res.setHeader('Content-Length',stat.size);
            fs.createReadStream(path).pipe(res);
            return;
        }
        //if is set, then get the range as numbers, set the headers and start the streaming
        const [startString,endString] = range.replace('/bytes=/','').split('-');
        const start = parseInt(startString,10);
        const end = endString ? parseInt(endString,10) : stat.size-1;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Length', end - start + 1);
        fs.createReadStream(path,{start,end}).pipe(res);
        return;
    }
    
    @Get('download/:id')
    @UseGuards(JwtGuard)
    async downloadResource(@Req() req: { user: Token }, @Param('id') id:number, @Res() res:Response){
        //get the full stream to the file of the specified resource
        const stream:fs.ReadStream = await this.accessService.downloadResources(id,req.user);
        //stream
        stream.pipe(res);
    }

    @Post('search')
    @UseGuards(JwtGuard)
    async search(@Body() searchDto:SearchResourceDto){
        console.log(searchDto);
        const result =  await this.accessService.searchResource(searchDto);
        console.log(result);
        return result;
    }

    @Post('request')
    @UseGuards(JwtGuard)
    async requestCollaboration(@Req() req: { user: Token }){
        return await this.requestService.requestCollaboration(req.user);
    }

    @Get('rsrc_ref/:id')
    @UseGuards(JwtGuard)
    async getResourceReference(@Req() req: { user: Token }, @Param('id') id:number){
        return await this.accessService.createResourceReference(id,req.user);
    }
}
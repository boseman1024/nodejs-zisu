const superagent = require('superagent')
const cheerio = require('cheerio')
require('superagent-charset')(superagent)

const baseurl = 'http://jwgl.zisu.edu.cn/'
class info{
	static async getAll(ctx){
		//const {id,pwd} = ctx.request.body
	let id='17080702026'
	let pwd='17080702026'
	//获取cookie
	const loginpage = await superagent.get(baseurl+'/login.jsp')
	let cookie = loginpage.header['set-cookie'].toString().substring(0,32)
	//模拟登录
	await superagent.post(baseurl+'/loginAction.do').send('zjh='+id).send('mm='+pwd)
		.set('Cookie', cookie)
	//获取成绩页，按方案查询
	let allGrade = {'type':'','data':[]}
	const page = await superagent.get(baseurl+'/gradeLnAllAction.do').query('type=ln&oper=fa')
		.set('Cookie', cookie)
	let $ = cheerio.load(page.text)
	const gradeLink = $('.table_k').find('tbody tr td table').last().find('tbody td a').attr('href')
	const gradePage = await superagent.get(baseurl+gradeLink).set('Cookie', cookie).charset('gbk')
	$ = cheerio.load(gradePage.text)
	//获取方案
	const title = $('#tblHead').find('tbody tr td table tbody tr').last().find('b').text()
	allGrade.type=title
	//获取成绩详情
	let list=[]
	$('.displayTag').find('tbody tr').each(function(i,elem){
		$(this).find('td').each(function(n,elem){
			list[n]=$(this).text().trim()
						//console.log(n+' '+$(this).text())
		})
		allGrade.data[i]={'index':i,'class':list.toString()}
	})
	return ctx.body = {success:true,info:allGrade}
	}

}

module.exports = info
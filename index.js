const Moment = require('moment');
Moment.locale('TR')
const Discord = require('discord.js');
const client = new Discord.Client();

const { token, logChannel } = require('./config.json');

client.on('ready', () => {
	console.log('Client is now ready!')
})

client.on('message', (message) => {
	if (message.content === '-join') {
		if (!message.author.id === '769437099190911007') {
			client.emit('guildMemberAdd', message.member)
		}
	}

	if (message.content === '-leave') {
		if (!message.author.id === '769437099190911007') {
			client.emit('guildMemberRemove', message.member)
		}
	}
})

client.on('messageDelete', async (message) => {
	const channelLog = client.channels.cache.get(logChannel);
	let logs = await message.guild.fetchAuditLogs({
		type: 'MESSAGE_DELETE'
	});

	let entry = logs.entries.first()
	

	const Embed = new Discord.MessageEmbed()
	.setColor('BLUE')
	.setTitle('Bir mesaj silindi!')
	.addFields([
		{ name: 'Mesaj sahibi', value: `${message.author} (${message.author.id})` },
		{ name: 'Mesajı silen', value: `${entry.executor} (${entry.executor.id})` },
		{ name: 'Mesaj içeriği', value: message.content },
	])

	channelLog.send({ embed: Embed })
})

client.on('messageUpdate', async (oldMessage, newMessage) => {
	const channelLog = client.channels.cache.get(logChannel);
	let logs = await oldMessage.guild.fetchAuditLogs({
		type: 'MESSAGE_UPDATE'
	})

	let entry = logs.entries.first()

	if (oldMessage.author.bot) return;
	if (oldMessage.content == newMessage.content) return;

	const Embed = new Discord.MessageEmbed()
	.setColor('BLUE')
	.setTitle('Bir mesaj güncellendi!')
	.addFields([
		{ name: 'Mesajı güncelleyen', value: `${entry.executor} (${entry.executor.id})` },
		{ name: 'Mesajın önceki hali', value: oldMessage, inline: true },
		{ name: 'Mesajın sonraki hali', value: newMessage, inline: true },
	])

	channelLog.send({ embed: Embed })
})

client.on('guildUpdate', async (oldGuild, newGuild) => {
	const channelLog = client.channels.cache.get(logChannel);
	let logs = await oldGuild.fetchAuditLogs({
		type: 'GUILD_UPDATE'
	})

	let entry = logs.entries.first()

	const Embed = new Discord.MessageEmbed()
	.setColor('BLUE')
	.setTitle('Sunucu güncellendi!')
	.addFields([
		{ name: 'Sunucuyu güncelleyen', value: `${entry.executor} (${entry.executor.id})` },
		{ name: 'Önceki sunucu adı', value: oldGuild.name, inline: true },
		{ name: 'Yeni sunucu adı', value: newGuild.name, inline: true },
	])

	channelLog.send({ embed: Embed })

})

client.on('channelCreate', async (channel) => {
	const channelLog = client.channels.cache.get(logChannel);

	const channelType = channel.type
	.replace('text', 'Yazı')
	.replace('voice', 'Ses')
	.replace('category', 'Kategori')

	const channelName = channel.name

	const createdDate = Moment(channel.createdAt).format('LLLL')

	let logs = await channel.guild.fetchAuditLogs({
		type: 'CHANNEL_CREATE'
	})

	let entry = logs.entries.first()

	const Embed = new Discord.MessageEmbed()
	.setColor('BLUE')
	.setTitle('Bir kanal oluşturuldu!')
	.addFields([
		{ name: 'Kanalı oluşturan', value: `${entry.executor} (${entry.executor.id})` },
		{ name: 'Kanal ismi', value: channelName, inline: true },
		{ name: 'Kanal tipi', value: channelType, inline: true },
		{ name: 'Kanal oluşturulma zamanı', value: createdDate, inline: true },
	])

	channelLog.send({ embed: Embed })
	
	
})

client.on('channelDelete', async (channel) => {
	const channelLog = client.channels.cache.get(logChannel);

	const channelType = channel.type
	.replace('text', 'Yazı')
	.replace('voice', 'Ses')
	.replace('category', 'Kategori')

	const channelName = channel.name

	const createdDate = Moment(channel.createdAt).format('LLLL')

	let logs = await channel.guild.fetchAuditLogs({
		type: 'CHANNEL_DELETE'
	})

	let entry = logs.entries.first()

	const Embed = new Discord.MessageEmbed()
	.setColor('BLUE')
	.setTitle('Bir kanal silindi!')
	.addFields([
		{ name: 'Kanalı silen', value: `${entry.executor} (${entry.executor.id})` },
		{ name: 'Kanal ismi', value: channelName, inline: true },
		{ name: 'Kanal tipi', value: channelType, inline: true },
		{ name: 'Kanal oluşturulma zamanı', value: createdDate, inline: true },
	])

	channelLog.send({ embed: Embed })
	
	
})


client.login(token)

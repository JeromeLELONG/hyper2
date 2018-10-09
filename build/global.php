<?php
/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * @NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */

return [
	'db' => [
		//'driver'         => 'Pdo',
		'driver' => 'pdo',
		'username' => 'userPresence',
		'password' => 'kLW6j+X',
		'database' => 'presence',
		'host'     => 'minosdev.cnam.fr',
		'dsn'            => 'mysql:dbname=presence;host=minosdev.cnam.fr',
		'driver_options' => [
				PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\'',
				PDO::MYSQL_ATTR_LOCAL_INFILE => TRUE
				],
],
'view_manager' => [
'display_exceptions' => true,
],	
	'zff-html2pdf' => [
				//HTML2PDF factory options
				'options' => [
						'orientation' => 'P',
						'format'      => 'A4',
						'lang'        => 'en',
						'unicode'     => true,
						'encoding'    => 'UTF-8',
						'margins'      => [0, 0, 0, 0],
				],
		],
		'logPath' => '/tmp/log_access_hyper.txt',
		'ldap' => array(
			'server' => array(
					'host' => 'ldap.cnam.fr',
					'port' => '389',
					'accountDomainName' => 'cnam.fr',
					'accountDomainNameShort' => 'cnam',
					'baseDn' => "ou=people,o=personnel,dc=cnam,dc=fr",
					'bindRequiresDn' => true
			),
	),
];

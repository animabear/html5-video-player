$(function() {
	var
		$player = $('#player'),
		$play = $('#play'),
		$stop = $('#stop'),
		$volume = $('#volume'),
		$expand = $('#expand'),
		$upload = $('#upload');

	var player = $player[0];
	var 
		$file = $('#file'),
		$timer = $('#timer');
	var
		$progressBar = $('#progressBar'),
		$innerBar = $('#innerBar');

	$play
		.on('click', function() {
			if (player.paused) {
				player.play();
				$(this).removeClass('icon-play').addClass('icon-pause');
			} else {
				player.pause();
				$(this).removeClass('icon-pause').addClass('icon-play');
			}
		});

	$stop
		.on('click', function() {
			player.currentTime = 0;
		});

	$volume
		.on('click', function() {
			if (player.muted) {
				player.muted = false;
				$(this).removeClass('icon-volume-mute').addClass('icon-volume');
			} else {
				player.muted = true;
				$(this).removeClass('icon-volume').addClass('icon-volume-mute');
			}
		});

	$expand
		.on('click', function() {
			if (!document.webkitIsFullScreen) {
				player.webkitRequestFullScreen(); //全屏
				$(this).removeClass('icon-expand').addClass('icon-contract');
			} else {
				document.webkitCancelFullScreen();
				$(this).removeClass('icon-contract').addClass('icon-expand');
			}
		});

	$upload
		.on('click', function() {
			$file.trigger('click');
		});

	$file
		.on('change', function(e) {
			var file = e.target.files[0],
				canPlayType = player.canPlayType(file.type);

			if (canPlayType === 'maybe' || canPlayType === 'probably') {
				src = window.URL.createObjectURL(file);
				player.src = src;
				player.onload = function() {
					window.URL.revokeObjectURL(src);
				};
			} else {
				alert("浏览器不支持您选择的文件格式");
			}
		});

	$player
		.on('timeupdate', function() {
			//秒数转换
			var time = player.currentTime.toFixed(1),
				minutes = Math.floor((time / 60) % 60),
				seconds = Math.floor(time % 60);
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			$timer.text(minutes + ':' + seconds);
		});

	$progressBar
		.on('click', function(e) {
			var w = $(this).width(),
				x = e.offsetX,
				per = Math.round(x / w);
			$innerBar.css('width', per + '%');
		});
});

/** question:
  * 1. 控制栏
  */
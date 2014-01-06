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
		$innerBar = $('#innerBar'),
		$volumeControl = $('#volume-control'),
		$volumeInner = $('#volume-inner');

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
			$innerBar.css('width', 0 + 'px');
		});

	$volume
		.on('click', function() {
			if (player.muted) {
				player.muted = false;
				$(this).removeClass('icon-volume-mute').addClass('icon-volume');
				$volumeInner.css('width', 100 + '%');
			} else {
				player.muted = true;
				$(this).removeClass('icon-volume').addClass('icon-volume-mute');
				$volumeInner.css('width', 0);
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
				$play.removeClass('icon-pause').addClass('icon-play'); //新打开的视频处于paused状态
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

			var w = $progressBar.width();
			if (player.duration) {
				var per = (player.currentTime / player.duration).toFixed(3);
				window.per = per;
			} else {
				per = 0;
			}
			$innerBar.css('width', (w * per).toFixed(0) + 'px');

			if (player.ended) { //播放完毕
				$play.removeClass('icon-pause').addClass('icon-play'); 
			}
		});

	$progressBar
		.on('click', function(e) {
			var w = $(this).width(),
				x = e.offsetX;
			window.per = (x / w).toFixed(3); //全局变量

			var duration = player.duration;
			player.currentTime = (duration * window.per).toFixed(0);

			$innerBar.css('width', x + 'px');
		});

	$volumeControl
		.on('click', function(e) {
			var w = $(this).width(),
				x = e.offsetX;
			window.vol = (x / w).toFixed(1); //全局变量

			player.volume = window.vol;
			$volumeInner.css('width', x + 'px');
		});

	$(document)
		.on('webkitfullscreenchange', function(e) {
			var w = $progressBar.width(),
				w1 = $volumeControl.width();
			if (window.per) {
				$innerBar.css('width', (window.per * w).toFixed(0) + 'px');
			}
			if (window.vol) {
				$volumeInner.css('width', (window.vol * w1).toFixed(0) + 'px')
			}
		});
});

/** question:
  * 1. 控制栏
  */
 interface Login {
    token: string;
    refreshToken: string;
}
 interface Current {
	id: number;
	username: string;
	userAccount: string;
	avatarUrl: string;
	userPassword: string;
	userStatus: number;
	createTime: string;
	updateTime: string;
	isDelete: number;
	userRole: number;
}


 interface photoAlbum {
	id: number;
	name: string;
	url: string;
	upload_time: string;
	category: string;
	is_deleted: number;
	last_modified_time: string;
}

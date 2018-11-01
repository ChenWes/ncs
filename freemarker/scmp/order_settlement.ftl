<Transmission>
	<TransmissionHeader>
		<UserName>NCS.INTEGRATION_SCMP</UserName>
		<Password Type="#PasswordDigest">SiymIPzkKmk1cyGDywLaiW9zBIix4bckgtcv3eAQKkI=</Password>
	</TransmissionHeader>
	<TransmissionBody>
		<#list orders as header>
			<GLogXMLElement>
				<Release>
					<ReleaseGid>
						<Gid>
							<DomainName>NCS</DomainName>
							<Xid>${header.ORDER_RELEASE_XID}</Xid>
							<#comment>OR_GID 这是OTM订单GID 需要系统生成 或者调用OTM的ID 规则</#comment>
						</Gid>
					</ReleaseGid>
					<TransactionCode>I</TransactionCode>
					<ReleaseHeader>
						<ReleaseName>${header.ISSUE_CODE}</ReleaseName>
						<ReleaseMethodGid>
							<Gid>
								<DomainName>PUBLIC</DomainName>
								<Xid>SHIP_UNITS</Xid>
							</Gid>
						</ReleaseMethodGid>
						<FlexFieldStrings>
							<Attribute6>${header.WORK_ORDER_NO}</Attribute6>
							<#comment>BOX_DETAILS.WORK_ORDER_NO 当工顺，第三层 BOX_DETAILS 中的数据</#comment>
							<Attribute7>${header.PART_CODE!}</Attribute7>
							<#comment>BOX_DETAILS.PART_NAME 零件名称，第三层 BOX_DETAILS 中的数据</#comment>
							<Attribute10>${header.APPLY_CODE}</Attribute10>
							<#comment>APPLY_CODE 申请单号</#comment>
							<Attribute12>正常配车</Attribute12>
							<Attribute13>${header.SUPPLIER_CODE}</Attribute13>
							<#comment>SUPPLIER_CODE 供应商编码</#comment>
							<Attribute14>${header.SUPPLIER_NAME}</Attribute14>
							<#comment>通过 SELECT corporation_name FROM corporation where corporation_gid = 'SUPPLIER_CODE'</#comment>
							<Attribute17/>
							<Attribute18>${header.NEED_GOODS_CODE}</Attribute18>
							<#comment>NEED_GOODS_CODE 要货方编码</#comment>
							<Attribute19>${header.ATTRIBUTE19}</Attribute19>
							<#comment>根据 SELECT DECODE(ZONE2,'郑州','C2','C1') FROM LOCATION WHERE LOCATION_XID = '发货地编码 SEND_PLACE_CODE对应的LOCAITON_XID 见 LocationRef'</#comment>
							<Attribute20>${header.ATTRIBUTE20}</Attribute20>
							<#comment>根据 SELECT ZONE2 FROM LOCATION WHERE LOCATION_XID = '发货地编码 SEND_PLACE_CODE SEND_PLACE_CODE对应的LOCAITON_XID 见 LocationRef'</#comment>
						</FlexFieldStrings>
						<FlexFieldNumbers>
							<AttributeNumber1>${header.F_count?c}</AttributeNumber1>
							<#comment>按照发行号 托盘数汇总 F 混装一个托盘只能汇总一次</#comment>
							<AttributeNumber2>${header.T_count?c}</AttributeNumber2>
							<#comment>按照发行号 铁架数汇总 </#comment>
							<AttributeNumber6>${header.BOX_QTY?c}</AttributeNumber6>
						</FlexFieldNumbers>
						<FlexFieldDates/>
						<FlexFieldCurrencies/>
					</ReleaseHeader>
					<ShipFromLocationRef>
						<LocationRef>
							<LocationGid>
								<Gid>
									<DomainName>NCS</DomainName>
									<Xid>${header.SHIP_FROM_LOCATION_XID}</Xid>
									<#comment>需要转换OTM的ID , SELECT LOCATION_GID FROM LOCATION_REFNUM WHERE LOCATION_REFNUM_QUAL_GID = 'NCS.出货地代码-DFL' AND LOCATION_REFNUM_VALUE = 'SUPPLIER_CODE' || '-' || 'SEND_PLACE_CODE'</#comment>
								</Gid>
							</LocationGid>
						</LocationRef>
					</ShipFromLocationRef>
					<ShipToLocationRef>
						<LocationRef>
							<LocationGid>
								<Gid>
									<DomainName>NCS</DomainName>
									<Xid>${header.NEED_PLACE_CODE}</Xid>
									<#comment>NEED_PLACE_CODE 要货地点编码</#comment>
								</Gid>
							</LocationGid>
						</LocationRef>
					</ShipToLocationRef>
					<TimeWindow>
						<#if header.EXPECT_TIME??>
						<EarlyPickupDt>
							<GLogDate><#if header.EXPECT_TIME??>${header.EXPECT_TIME!}</#if></GLogDate>
							<TZId>Asia/Shanghai</TZId>
							<TZOffset>+08:00</TZOffset>
						</EarlyPickupDt>
						</#if>
						<LateDeliveryDt>
							<GLogDate>${header.ARRI_PLAN_DATE}</GLogDate>
							<#comment>BOX_DETAILS.ARRI_PLAN_DATE 托盘纳期， 格式 yyyyMMddHHmmss 这里要注意，客户时间是29小时制超过24小时需要转换，如 20170510290000 需要转换成 20170509050000</#comment>
							<TZId>Asia/Shanghai</TZId>
							<TZOffset>+08:00</TZOffset>
						</LateDeliveryDt>
					</TimeWindow>
					<#list header.details as detail>
						<ReleaseLine>
							<#comment>一个发行号也是一行 头和明细是一对一的</#comment>
							<ReleaseLineGid>
								<Gid>
									<DomainName>NCS</DomainName>
									<Xid>${header.ORDER_RELEASE_XID}-001</Xid>
									<#comment>这是OTM订单GID || '-001'</#comment>
								</Gid>
							</ReleaseLineGid>
							<PackagedItemRef>
								<PackagedItem>
									<Packaging>
										<PackagedItemGid>
											<Gid>
												<DomainName>NCS</DomainName>
												<Xid>${detail.PART_CODE}</Xid>
												<#comment>货品编码 BOX_DETAILS.PART_CODE</#comment>
											</Gid>
										</PackagedItemGid>
									</Packaging>
									<Item>
										<TransactionCode>IU</TransactionCode>
										<ItemGid>
											<Gid>
												<DomainName>NCS</DomainName>
												<Xid>${detail.PART_CODE}</Xid>
												<#comment>货品编码 BOX_DETAILS.PART_CODE</#comment>
											</Gid>
										</ItemGid>
									</Item>
								</PackagedItem>
							</PackagedItemRef>
							<ItemQuantity>
								<WeightVolume>
									<Weight>
										<WeightValue>0.0</WeightValue>
										<WeightUOMGid>
											<Gid>
												<Xid>LB</Xid>
											</Gid>
										</WeightUOMGid>
									</Weight>
									<Volume>
										<VolumeValue>0.0</VolumeValue>
										<VolumeUOMGid>
											<Gid>
												<Xid>CUFT</Xid>
											</Gid>
										</VolumeUOMGid>
									</Volume>
								</WeightVolume>
							</ItemQuantity>
							<PackagedItemSpecCount>${detail.QTY?c}</PackagedItemSpecCount>
							<#comment>BOX_DETAIL_MODEL.QTY</#comment>
							<FlexFieldStrings>
								<Attribute3>${detail.PACK_LABEL_CODE}</Attribute3>
								<#comment>BOX_DETAILS.PACK_LABEL_CODE 包装标签编码，第三层 BOX_DETAILS 中的数据</#comment>
								<Attribute4>${detail.PART_NAME!}</Attribute4>
								<#comment>BOX_DETAILS.PART_NAME 零件名称，第三层 BOX_DETAILS 中的数据</#comment>
								<Attribute5>${detail.ISSUE_CODE}</Attribute5>
								<#comment>BOX_DETAILS.ISSUE_CODE 发行号，第三层 BOX_DETAILS 中的数据</#comment>
								<Attribute6>${detail.WORK_ORDER_NO}</Attribute6>
								<#comment>BOX_DETAILS.WORK_ORDER_NO 当工顺，第三层 BOX_DETAILS 中的数据
								</#comment>
							</FlexFieldStrings>
							<FlexFieldNumbers>
								<AttributeNumber1>${detail.QTY?c}</AttributeNumber1>
								<#comment>BOX_DETAIL_MODEL.QTY
								</#comment>
							</FlexFieldNumbers>
							<FlexFieldDates/>
						</ReleaseLine>
					</#list>
					<ReleaseTypeGid>
						<Gid>
							<DomainName>NCS</DomainName>
							<Xid>结算</Xid>
						</Gid>
					</ReleaseTypeGid>
					<TotalWeightVolume>
						<WeightVolume>
							<Weight>
								<WeightValue>0.0</WeightValue>
								<WeightUOMGid>
									<Gid>
										<Xid>LB</Xid>
									</Gid>
								</WeightUOMGid>
							</Weight>
							<Volume>
								<VolumeValue>0.0</VolumeValue>
								<VolumeUOMGid>
									<Gid>
										<Xid>CUFT</Xid>
									</Gid>
								</VolumeUOMGid>
							</Volume>
						</WeightVolume>
					</TotalWeightVolume>
				</Release>
			</GLogXMLElement>
		</#list>
	</TransmissionBody>
</Transmission>
